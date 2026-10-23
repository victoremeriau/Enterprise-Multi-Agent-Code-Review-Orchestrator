import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { codeQualityAnalyzerPrompt } from '../prompts/index.js';

/**
 * Code Quality Analyzer Agent
 *
 * Analyzes code for security vulnerabilities, performance issues,
 * and maintainability concerns.
 */
export const codeQualityAnalyzerAgent: AgentDefinition = {
  description: 'Analyzes code for security vulnerabilities, performance issues, and maintainability concerns. Uses static analysis and best practice evaluation to identify critical quality issues.',
  prompt: codeQualityAnalyzerPrompt,
  model: 'inherit',
  tools: ['Read', 'Grep', 'Glob', 'Skill']
};
