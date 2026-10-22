import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { refactoringSuggesterPrompt } from '../prompts/index.js';

/**
 * Refactoring Suggester Agent
 *
 * Identifies opportunities to apply design patterns, modernize language
 * features, and improve code clarity.
 */
export const refactoringSuggesterAgent: AgentDefinition = {
  description: 'Identifies opportunities to apply design patterns, use modern language features, and improve code structure. Suggests extract method/class candidates and identifies dead code.',
  prompt: refactoringSuggesterPrompt,
  model: 'inherit',
  tools: ['Skill']
};
