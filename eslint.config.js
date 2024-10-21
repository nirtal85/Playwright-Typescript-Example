import typescript from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';
import importPlugin from 'eslint-plugin-import';
import typescriptParser from '@typescript-eslint/parser';

const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
      playwright: playwright,
      import: importPlugin, // Add the import plugin here
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
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
  },
];
