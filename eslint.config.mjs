// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
        ecmaVersion: 2022,
      },
    },
  },
  // Add simple-import-sort rules
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  // Add base rules
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-console': 'warn',
      'no-process-exit': 'off',
    },
  },
  // Add overrides for TS files with complex import sorting
  {
    files: ['**/*.ts'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
            ],
            [
              '^node:.*\\u0000$',
              '^@?\\w.*\\u0000$',
              '^[^.].*\\u0000$',
              '^\\..*\\u0000$',
            ],
            ['^\\u0000'],
            ['^node:'],
            ['^@?\\w'],
            ['^@/src(/.*|$)'],
            ['^@/shared(/.*|$)'],
            ['^@/http-api(/.*|$)'],
            ['^@/contexts(/.*|$)'],
            ['^@/users(/.*|$)'],
            ['^@/tests(/.*|$)'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],
    },
  },
);
