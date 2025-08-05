const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        browser: true,
        es6: true,
        node: true,
      },
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Force single quotes
      'quotes': ['error', 'single'],

      // Allow logs
      'no-console': 1,

      // Force no ununsed variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 2,

      // Allow object type
      '@typescript-eslint/ban-types': 0,

      // Force windows linebreak styles
      'linebreak-style': [2, 'windows'],

      // Force semicolons
      'semi': [2, 'always'],

      // Turn off explicit return type
      '@typescript-eslint/explicit-function-return-type': 0,

      // React rules
      'react/display-name': 0,
      'react/jsx-key': 1,
      'react/jsx-no-duplicate-props': 1,
      'react/jsx-no-undef': 1,
      'react/jsx-uses-react': 1,
      'react/jsx-uses-vars': 1,
      'react/no-deprecated': 1,
      'react/no-direct-mutation-state': 1,
      'react/react-in-jsx-scope': 1,

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
