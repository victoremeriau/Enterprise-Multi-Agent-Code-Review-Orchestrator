import { describe, it, expect } from 'vitest';
import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema,
  ReviewReportSchema
} from '../src/types/index.js';

describe('Schema Validation', () => {
  describe('CodeQualityResultSchema', () => {
    it('should validate correct code quality result', () => {
      const validData = {
        file: 'src/main.ts',
        issues: [
          {
            line: 42,
            severity: 'high' as const,
            category: 'security' as const,
            description: 'Potential SQL injection vulnerability',
            suggestion: 'Use parameterized queries'
          }
        ],
        overallScore: 75,
        summary: 'Code quality issues found'
      };

      const result = CodeQualityResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid severity level', () => {
      const invalidData = {
        file: 'src/main.ts',
        issues: [
          {
            line: 42,
            severity: 'invalid' as any,
            category: 'security',
            description: 'Test issue',
            suggestion: 'Test fix'
          }
        ],
        overallScore: 75,
        summary: 'Test'
      };

      const result = CodeQualityResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid score (out of range)', () => {
      const invalidData = {
        file: 'src/main.ts',
        issues: [],
        overallScore: 150,
        summary: 'Test'
      };

      const result = CodeQualityResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept empty issues array', () => {
      const validData = {
        file: 'src/main.ts',
        issues: [],
        overallScore: 100,
        summary: 'No issues found'
      };

      const result = CodeQualityResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        file: 'src/main.ts'
        // Missing issues, overallScore, summary
      };

      const result = CodeQualityResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('TestCoverageResultSchema', () => {
    it('should validate correct test coverage result', () => {
      const validData = {
        file: 'src/utils/helper.ts',
        hasTests: true,
        testFiles: ['src/utils/helper.test.ts'],
        untestedPaths: [
          {
            type: 'function' as const,
            location: 'calculateDiscount at line 42',
            priority: 'high' as const,
            reasoning: 'Critical business logic',
            suggestedTest: 'test("calculateDiscount returns correct value", () => { ... })'
          }
        ],
        coverageEstimate: 85,
        summary: 'Good coverage with gaps'
      };

      const result = TestCoverageResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with empty untested paths', () => {
      const validData = {
        file: 'src/utils/helper.ts',
        hasTests: true,
        testFiles: ['src/utils/helper.test.ts'],
        untestedPaths: [],
        coverageEstimate: 100,
        summary: 'Fully covered'
      };

      const result = TestCoverageResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject coverage estimate > 100', () => {
      const invalidData = {
        file: 'src/utils/helper.ts',
        hasTests: true,
        testFiles: [],
        untestedPaths: [],
        coverageEstimate: 150,
        summary: 'Test'
      };

      const result = TestCoverageResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate with no test files', () => {
      const validData = {
        file: 'src/utils/helper.ts',
        hasTests: false,
        testFiles: [],
        untestedPaths: [
          {
            type: 'function' as const,
            location: 'calculateDiscount',
            priority: 'critical' as const,
            reasoning: 'No tests exist',
            suggestedTest: 'Create test file'
          }
        ],
        coverageEstimate: 0,
        summary: 'No coverage'
      };

      const result = TestCoverageResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('RefactoringSuggestionSchema', () => {
    it('should validate correct refactoring suggestion', () => {
      const validData = {
        file: 'src/service.ts',
        suggestions: [
          {
            type: 'extract-function' as const,
            location: 'processData at line 50',
            impact: 'high' as const,
            description: 'Extract validation logic',
            before: 'if (x > 0 && y < 100) { ... }',
            after: 'if (isValid(x, y)) { ... }',
            benefits: 'Improves readability'
          }
        ],
        summary: 'Several refactoring opportunities'
      };

      const result = RefactoringSuggestionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with empty suggestions', () => {
      const validData = {
        file: 'src/service.ts',
        suggestions: [],
        summary: 'No refactoring needed'
      };

      const result = RefactoringSuggestionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid suggestion type', () => {
      const invalidData = {
        file: 'src/service.ts',
        suggestions: [
          {
            type: 'invalid-type' as any,
            location: 'test',
            impact: 'high',
            description: 'test',
            before: 'test',
            after: 'test',
            benefits: 'test'
          }
        ],
        summary: 'Test'
      };

      const result = RefactoringSuggestionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate different suggestion types', () => {
      const types = [
        'extract-function',
        'rename',
        'modernize',
        'simplify',
        'pattern-improvement'
      ];

      for (const type of types) {
        const validData = {
          file: 'src/test.ts',
          suggestions: [
            {
              type: type as any,
              location: 'test',
              impact: 'medium' as const,
              description: 'test',
              before: 'test',
              after: 'test',
              benefits: 'test'
            }
          ],
          summary: 'Test'
        };

        const result = RefactoringSuggestionSchema.safeParse(validData);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('ReviewReportSchema', () => {
    it('should validate complete review report', () => {
      const validData = {
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        },
        fileReviews: [
          {
            file: 'src/main.ts',
            codeQuality: {
              file: 'src/main.ts',
              issues: [],
              overallScore: 85,
              summary: 'Good quality'
            },
            testCoverage: {
              file: 'src/main.ts',
              hasTests: true,
              testFiles: ['src/main.test.ts'],
              untestedPaths: [],
              coverageEstimate: 90,
              summary: 'Well tested'
            },
            refactorings: {
              file: 'src/main.ts',
              suggestions: [],
              summary: 'No refactoring needed'
            }
          }
        ],
        summary: {
          totalFiles: 1,
          overallScore: 85,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [
          {
            priority: 'low' as const,
            category: 'documentation',
            description: 'Add inline comments',
            files: ['src/main.ts']
          }
        ],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 5000,
          agentVersions: {
            'code-quality-analyzer': '1.0.0',
            'test-coverage-analyzer': '1.0.0',
            'refactoring-suggester': '1.0.0'
          }
        }
      };

      const result = ReviewReportSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with empty file reviews', () => {
      const validData = {
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 100,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {}
        }
      };

      const result = ReviewReportSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing pull request info', () => {
      const invalidData = {
        // Missing pullRequest
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 100,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {}
        }
      };

      const result = ReviewReportSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid priority in recommendations', () => {
      const invalidData = {
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 100,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [
          {
            priority: 'invalid' as any,
            category: 'test',
            description: 'test',
            files: []
          }
        ],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {}
        }
      };

      const result = ReviewReportSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary scores (0 and 100)', () => {
      const score0 = CodeQualityResultSchema.safeParse({
        file: 'test.ts',
        issues: [],
        overallScore: 0,
        summary: 'Critical issues'
      });
      expect(score0.success).toBe(true);

      const score100 = CodeQualityResultSchema.safeParse({
        file: 'test.ts',
        issues: [],
        overallScore: 100,
        summary: 'Perfect score'
      });
      expect(score100.success).toBe(true);
    });

    it('should handle large arrays', () => {
      const largeIssues = Array.from({ length: 100 }, (_, i) => ({
        line: i + 1,
        severity: 'low' as const,
        category: 'style' as const,
        description: `Issue ${i}`,
        suggestion: `Fix ${i}`
      }));

      const result = CodeQualityResultSchema.safeParse({
        file: 'test.ts',
        issues: largeIssues,
        overallScore: 50,
        summary: 'Many issues'
      });

      expect(result.success).toBe(true);
      expect(result.data?.issues.length).toBe(100);
    });

    it('should handle special characters in strings', () => {
      const result = CodeQualityResultSchema.safeParse({
        file: 'src/special-file.ts',
        issues: [
          {
            line: 1,
            severity: 'high' as const,
            category: 'security' as const,
            description: 'Issue with "quotes" and \'apostrophes\' & special chars!',
            suggestion: 'Fix with `backticks` and (parentheses)'
          }
        ],
        overallScore: 75,
        summary: 'Test with émojis 🚀 and unicode'
      });

      expect(result.success).toBe(true);
    });
  });
});
