import * as dotenv from 'dotenv';
import { CodeReviewOrchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // Validate command line arguments
  if (!owner || !repo || !prStr) {
    console.error('Usage: npm run dev <owner> <repo> <pr-number>');
    console.error('Example: npm run dev octocat Hello-World 1');
    process.exit(1);
  }

  // Validate PR number is a positive integer
  const prNumber = parseInt(prStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error(
      `Error: PR number must be a positive integer, got: ${prStr}`
    );
    process.exit(1);
  }

  // Validate authentication
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasAWS =
    !!process.env.AWS_ACCESS_KEY_ID &&
    !!process.env.AWS_SECRET_ACCESS_KEY;

  if (!hasAnthropic && !hasAWS) {
    console.error('Error: Missing authentication credentials');
    console.error('');
    console.error('Please configure one of the following:');
    console.error('');
    console.error('Option 1: Anthropic API');
    console.error('  - Set ANTHROPIC_API_KEY environment variable');
    console.error('');
    console.error('Option 2: AWS Bedrock');
    console.error('  - Set AWS_ACCESS_KEY_ID environment variable');
    console.error('  - Set AWS_SECRET_ACCESS_KEY environment variable');
    console.error('  - Set AWS_REGION environment variable');
    process.exit(1);
  }

  // Log authentication method
  if (hasAWS) {
    if (!process.env.AWS_REGION) {
      console.error(
        'Error: AWS_REGION environment variable required for Bedrock'
      );
      process.exit(1);
    }
    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.log('🔐 Using Anthropic API authentication');
  }

  // Validate ANTHROPIC_MODEL
  const model = process.env.ANTHROPIC_MODEL;
  if (!model) {
    console.error('Error: ANTHROPIC_MODEL environment variable is not set');
    console.error('');
    console.error('Set it in your .env file:');
    console.error('');
    if (hasAWS) {
      console.error(
        '  ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0'
      );
    } else {
      console.error('  ANTHROPIC_MODEL=claude-sonnet-4-5-20250929');
    }
    process.exit(1);
  }

  try {
    logger.info(`Starting code review for ${owner}/${repo} PR #${prNumber}`);
    console.log('');
    console.log(`📋 Analyzing ${owner}/${repo} PR #${prNumber}...`);
    console.log('');

    // Create orchestrator instance
    const orchestrator = new CodeReviewOrchestrator();

    // Run the review
    const report = await orchestrator.reviewPullRequest(
      owner,
      repo,
      prNumber
    );

    // Validate that we got actual analysis results, not just fallback data
    if (report.fileReviews.length === 0) {
      throw new Error(
        'Analysis completed but produced no file reviews. Check MCP tools, Task delegation, and subagent tool configuration before generating reports.'
      );
    }

    console.log('✓ Analysis complete!');
    console.log('');

    // Generate reports in all formats
    const reportGenerator = new ReportGenerator();

    // Create report filename
    const reportName = `${owner}_${repo}_${prNumber}`;

    // Generate JSON report
    const jsonPath = await reportGenerator.toJSON(report, reportName);
    console.log(`✓ Generated JSON report: ${jsonPath}`);

    // Generate Markdown report
    const mdPath = await reportGenerator.toMarkdown(report, reportName);
    console.log(`✓ Generated Markdown report: ${mdPath}`);

    // Generate HTML report
    const htmlPath = await reportGenerator.toHTML(report, reportName);
    console.log(`✓ Generated HTML report: ${htmlPath}`);

    console.log('');
    logger.info(`Code review completed successfully for ${owner}/${repo} PR #${prNumber}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('');
      console.error(`❌ Error: ${error.message}`);
      logger.error('Main error:', error);
    } else {
      console.error('');
      console.error('❌ Unknown error occurred');
      logger.error('Main error:', error);
    }
    process.exit(1);
  }
}

main();
