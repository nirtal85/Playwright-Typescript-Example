// eslint.config.js
import eslintPlugin from '@typescript-eslint/eslint-plugin'; // Import the whole package

export default [
  {
    files: ['*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPlugin, // Use the default export as the plugin
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-console': 'error',
      'no-debugger': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      semi: ['error', 'always'],
      'import/order': [
        'error',
        { groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin'] },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    ignores: [
      'node_modules/',
      'test-results/',
      'allure-results/',
      'playwright-report/',
      'summary.json',
      '.vscode/*',
      '.DS_Store',
      'Thumbs.db',
      '*_spec3.json',
    ],
    extends: [
      'plugin:playwright/recommended', // Use the recommended Playwright settings
    ],
  },
];
