import { query } from '@anthropic-ai/claude-agent-sdk';
import { ReviewReport, ReviewReportSchema } from './types/index.js';
import { logger } from './utils/logger.js';
import { mcpServersConfig } from './config/mcp.config.js';
import {
  codeQualityAnalyzerAgent,
  testCoverageAnalyzerAgent,
  refactoringSuggesterAgent
} from './agents/index.js';
import { orchestratorPrompt } from './prompts/index.js';

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
}

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {
  constructor(options: OrchestratorOptions = {}) {
  }

  /**
   * Review a pull request using multi-agent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const startTime = Date.now();

    logger.info(`Starting code review for ${owner}/${repo} PR #${prNumber}`);

    try {
      // Prepare the analysis prompt
      const prompt = `${orchestratorPrompt}

Please analyze this GitHub pull request:
- Owner: ${owner}
- Repository: ${repo}
- PR Number: ${prNumber}

Fetch the PR data from GitHub, analyze all changed files for code quality, test coverage, and refactoring opportunities.
Use the code-quality-analyzer, test-coverage-analyzer, and refactoring-suggester agents for comprehensive analysis.
Return a detailed JSON report with all findings matching the ReviewReport schema.`;

      logger.debug('Initializing orchestrator query');

      // Call the SDK query function
      const result = query({
        prompt: prompt,
        options: {
          model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
          allowedTools: ['web_search', 'read', 'write', 'bash', 'skill'],
          agents: {
            'code-quality-analyzer': codeQualityAnalyzerAgent,
            'test-coverage-analyzer': testCoverageAnalyzerAgent,
            'refactoring-suggester': refactoringSuggesterAgent
          },
          mcpServers: mcpServersConfig as any,
          maxTurns: 10,
          permissionMode: 'acceptEdits'
        }
      });

      logger.debug('Processing orchestrator query results');

      // Process the async iterable result
      let finalReport: ReviewReport | null = null;
      let lastError: unknown = null;

      for await (const message of result) {
        if (message.type === 'result') {
          if (message.subtype === 'success') {
            logger.debug('Successfully completed orchestrator analysis');

            // Extract and parse the result
            try {
              const resultText = message.result || '';
              // Try to find JSON in the result
              const jsonMatch = resultText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const reportData = JSON.parse(jsonMatch[0]);
                const parseResult = ReviewReportSchema.safeParse(reportData);

                if (parseResult.success) {
                  finalReport = parseResult.data;
                } else {
                  logger.warn('Report validation failed, using fallback');
                  finalReport = this.createFallbackReport(owner, repo, prNumber);
                }
              } else {
                logger.warn('No JSON found in result, using fallback');
                finalReport = this.createFallbackReport(owner, repo, prNumber);
              }
            } catch (parseError) {
              logger.warn('Failed to parse result, using fallback', parseError);
              finalReport = this.createFallbackReport(owner, repo, prNumber);
            }
          } else if (message.subtype === 'error_during_execution') {
            lastError = message.errors?.join('\n');
            logger.error('Orchestrator execution error:', lastError);
          }
          break;
        }

        if (message.type === 'assistant' && message.message?.content) {
          logger.debug('Orchestrator response:', message.message.content);
        }
      }

      if (!finalReport) {
        throw new Error(
          lastError
            ? `Orchestrator failed: ${lastError}`
            : 'No valid review report generated from orchestrator'
        );
      }

      // Add duration metadata
      const duration = Date.now() - startTime;
      finalReport.metadata.duration = duration;
      finalReport.metadata.analyzedAt = new Date().toISOString();

      logger.info(`Code review completed in ${duration}ms`);
      return finalReport;

    } catch (error) {
      logger.error('Orchestrator error:', error);
      throw error;
    }
  }

  private createFallbackReport(
    owner: string,
    repo: string,
    prNumber: number
  ): ReviewReport {
    return {
      pullRequest: { owner, repo, number: prNumber },
      fileReviews: [],
      summary: {
        totalFiles: 0,
        overallScore: 0,
        criticalIssues: 0,
        highPriorityTests: 0,
        refactoringOpportunities: 0
      },
      recommendations: [
        {
          priority: 'medium',
          category: 'analysis',
          description: 'Could not complete full analysis',
          files: []
        }
      ],
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration: 0,
        agentVersions: {
          'code-quality-analyzer': '1.0.0',
          'test-coverage-analyzer': '1.0.0',
          'refactoring-suggester': '1.0.0'
        }
      }
    };
  }
}
