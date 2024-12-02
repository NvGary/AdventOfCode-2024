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
    files: ['test/**'],
    extends: [jestPlugin.configs['flat/recommended']],
  },
);
