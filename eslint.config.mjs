// @ts-check

import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
    // Config replacement for `.eslintignore`
        ignores: ['**/dist/**', 'jest.config.js'],
    },
    stylistic.configs.customize({
        flat: true,
        semi: true,
    }),
    eslint.configs.all,
    tseslint.configs.recommended,
    {
    // Disable type-aware linting on JS files
        extends: [tseslint.configs.disableTypeChecked],
        files: ['**/*.js'],
    },
    {
    // Enable jest rules on test files
        extends: [jestPlugin.configs['flat/recommended']],
        files: ['**/*.test.ts'],
        rules: {
            'init-declarations': 'off',
            'max-lines-per-function': 'off',
        }
    },
    {
    // Enable debugging rules
        files: ['**/output/*.ts', '**/index.ts'],
        rules: {
            'no-console': 'off',
        }
    },
    {
    // Custom rules
        rules: {
            '@stylistic/array-element-newline': ['error', 'consistent'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/comma-dangle': 'off',
            '@stylistic/indent': ['error', 4],
            '@typescript-eslint/no-unused-vars': ['error'],
            'array-callback-return': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'camelcase': ['error', { allow: ['_impl$'] }],
            'capitalized-comments': ['error', 'always', {
                ignoreConsecutiveComments: true,
                ignorePattern: 'console',
            }],
            'curly': 'error',
            'eqeqeq': 'error',
            'id-length': 'off',
            'max-statements': 'error',
            'no-eval': 'error',
            'no-magic-numbers': 'off',
            'no-plusplus': 'off',
            'no-ternary': 'off',
            'no-unused-vars': 'off',
            'no-useless-assignment': 'error',
            'no-useless-return': 'warn',
            'one-var': ['error', { const: 'never', let: 'never', var: 'always' }],
            'prefer-const': 'error',
            'prefer-destructuring': 'warn',
            'radix': 'warn',
            'sort-imports': 'warn',
            'sort-vars': 'error',
        }
    }
);
