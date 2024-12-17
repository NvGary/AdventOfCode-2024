// @ts-check

import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

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
    // importPlugin.flatConfigs.recommended,
    // importPlugin.flatConfigs.typescript,
    {
        extends: [
            // 'eslint:recommended',
            importPlugin.flatConfigs?.recommended,
            // The following lines do the trick
            importPlugin.flatConfigs?.typescript,
        ],
        settings: {
            'import/resolver': {
                // You will also need to install and configure the TypeScript resolver
                // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
                typescript: true,
                alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                node: true,
            },
        },
    },
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
        },
    },
    {
    // Enable debugging rules
        files: ['**/output/**/*', '**/index.ts'],
        rules: {
            'no-console': 'off',
        },
    },
    {
    // Custom rules
        rules: {
            '@stylistic/array-element-newline': ['error', 'consistent'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/comma-dangle': 'off',
            '@stylistic/indent': ['error', 4],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_',
                },
            ],
            'array-callback-return': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'camelcase': ['error', { allow: ['_impl$'] }],
            'capitalized-comments': [
                'error',
                'always',
                {
                    ignoreConsecutiveComments: true,
                    ignorePattern: 'console',
                },
            ],
            'curly': 'error',
            'eqeqeq': 'error',
            'id-length': 'off',
            'import/order': ['error', {
                groups: [
                    // Imports of builtins are first
                    'builtin',
                    // Then sibling and parent imports. They can be mingled together
                    'sibling',
                    'parent',
                    // Then index file imports
                    'index',
                    // Then any arcane TypeScript imports
                    'object',
                    // Then the omitted imports: internal, external, type, unknown
                ],
            }],
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
            // 'sort-imports': [
            //     'error',
            //     {
            //         allowSeparatedGroups: false,
            //         ignoreCase: true,
            //         ignoreDeclarationSort: false,
            //         ignoreMemberSort: false,
            //         memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            //     },
            // ],
            'sort-imports':
            [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true
                }
            ],
            'sort-keys': 'off',
            'sort-vars': 'error',
        },
    }
);
