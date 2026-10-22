import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

/**
 * Test Coverage Analyzer Agent
 *
 * Identifies functions/methods without test coverage and suggests
 * specific test cases with meaningful assertions.
 */
export const testCoverageAnalyzerAgent: AgentDefinition = {
  description: 'Evaluates test completeness by identifying untested functions and suggesting specific test cases with assertions. Estimates coverage and prioritizes critical untested paths.',
  prompt: 'Analyze test coverage for the provided code files. Identify functions and methods that lack test coverage, suggest specific test cases with meaningful assertions, and estimate overall coverage percentage.'
};
