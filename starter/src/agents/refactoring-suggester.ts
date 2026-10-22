import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

/**
 * Refactoring Suggester Agent
 *
 * Identifies opportunities to apply design patterns, modernize language
 * features, and improve code clarity.
 */
export const refactoringSuggesterAgent: AgentDefinition = {
  description: 'Identifies opportunities to apply design patterns, use modern language features, and improve code structure. Suggests extract method/class candidates and identifies dead code.',
  prompt: 'Analyze the provided code files for refactoring opportunities. Identify chances to apply design patterns, modernize language features, extract methods/classes, and improve overall code clarity.'
};
