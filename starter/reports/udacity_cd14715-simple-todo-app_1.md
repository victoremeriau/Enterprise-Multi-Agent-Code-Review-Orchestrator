# 🔍 Code Review Report

## Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | 72/100 |
| **Files Reviewed** | 1 |
| **Critical Issues** | 1 |
| **High Priority Tests** | 2 |
| **Refactoring Opportunities** | 2 |

## 🎯 Top Recommendations

1. 🚨 **security**: Input validation and sanitization need comprehensive security review and test coverage
   - Files: fixtures/clean-code.ts

2. ⚠️ **testing**: Add unit tests for email validation with international domains and edge cases
   - Files: fixtures/clean-code.ts

3. ⚠️ **testing**: Add security tests for XSS and injection attack patterns in sanitization
   - Files: fixtures/clean-code.ts

4. 📝 **refactoring**: Break down sanitizeInput function into smaller, focused utility functions
   - Files: fixtures/clean-code.ts

## 📁 File Details

### 📄 `fixtures/clean-code.ts`

**Quality Score:** 72/100 | **Coverage:** ~35%

#### Issues (3)
  - Line 15: `high` Email validation using regex pattern could be bypassed with certain Unicode characters
  - Line 28: `medium` Function `sanitizeInput` is too long (45 lines) and handles multiple concerns
  - Line 38: `low` Using `any` type for user input parameter reduces type safety


#### Test Gaps (2)
  - `sanitizeInput at line 28` (critical priority)
  - `validateEmail at line 10` (high priority)


#### Refactoring Opportunities (2)
  - **extract-function**: Extract regex sanitization logic into dedicated functions
  - **modernize**: Use modern regex syntax and optional chaining


---

*Generated at 2026-10-22T22:08:14.524Z • Duration: 54281ms*
