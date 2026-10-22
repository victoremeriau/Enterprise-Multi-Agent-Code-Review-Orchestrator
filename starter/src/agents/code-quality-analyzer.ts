import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

/**
 * Code Quality Analyzer Agent
 *
 * Analyzes code for security vulnerabilities, performance issues,
 * and maintainability concerns.
 */
export const codeQualityAnalyzerAgent: AgentDefinition = {
  description: 'Analyzes code for security vulnerabilities, performance issues, and maintainability concerns. Uses static analysis and best practice evaluation to identify critical quality issues.',
  prompt: 'Analyze the provided code files for security vulnerabilities, performance issues, and maintainability concerns. Provide detailed findings with specific line numbers and severity levels.'
};
