// @ts-check

import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // config replacement for `.eslintignore`
    ignores: ['**/dist/**', 'jest.config.js'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // enable jest rules on test files
    files: ['**/*.test.ts'],
    extends: [jestPlugin.configs['flat/recommended']],
  },
  {
    // custom rules
    rules: {
      "array-callback-return": "error",
      "curly": "error",
      "eqeqeq": "error",
      "max-statements": "error",
      "no-eval": "error",
      "no-useless-assignment": "error",
      "no-useless-return": "warn",
      "no-unused-vars": "off",
      "prefer-const": "error",
      "prefer-destructuring": "warn",
      "radix": "warn",
      "sort-imports": "warn",
      "sort-vars": "error",
      "@typescript-eslint/no-unused-vars": ["error"],
    }
  }
);
