import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { testCoverageAnalyzerPrompt } from '../prompts/index.js';

/**
 * Test Coverage Analyzer Agent
 *
 * Identifies functions/methods without test coverage and suggests
 * specific test cases with meaningful assertions.
 */
export const testCoverageAnalyzerAgent: AgentDefinition = {
  description: 'Evaluates test completeness by identifying untested functions and suggesting specific test cases with assertions. Estimates coverage and prioritizes critical untested paths.',
  prompt: testCoverageAnalyzerPrompt,
  model: 'inherit',
  tools: ['Skill']
};
