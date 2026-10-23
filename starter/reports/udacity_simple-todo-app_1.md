# 🔍 Code Review Report

## Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | 72/100 |
| **Files Reviewed** | 1 |
| **Critical Issues** | 1 |
| **High Priority Tests** | 2 |
| **Refactoring Opportunities** | 1 |

## 🎯 Top Recommendations

1. 🚨 **security**: Input validation and sanitization need comprehensive security review and test coverage
   - Files: fixtures/clean-code.ts

2. ⚠️ **testing**: Add unit tests for email validation with international domains and edge cases
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


#### Refactoring Opportunities (1)
  - **extract-function**: Extract regex sanitization logic into dedicated functions


---

*Generated at 2026-10-23T06:24:48.498Z • Duration: 141742ms*
