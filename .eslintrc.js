module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Indentation rule
    indent: 0,
    '@typescript-eslint/indent': ['error', 2],

    // Force single quotes
    quotes: ['error', 'single'],

    // Allow logs
    'no-console': 1,

    // Force no ununsed variables
    'no-unused-vars': 2,

    // Allow object type
    '@typescript-eslint/ban-types': 0,

    // Force windows linebreak styles
    'linebreak-style': [2, 'windows'],

    // Force semicolons
    semi: [2, 'always'],

    // Turn off explicit return type
    '@typescript-eslint/explicit-function-return-type': 0,

    // Turn off interface name prefixing
    '@typescript-eslint/interface-name-prefix': 0,

    // React rules
    'react/display-name': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-curly-spacing': 1,
    'react/jsx-handler-names': 1,
    'react/jsx-indent': ['warn', 2],
    'react/jsx-key': 1,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': 0,
    'react/jsx-no-duplicate-props': 1,
    'react/jsx-no-literals': 0,
    'react/jsx-no-undef': 1,
    'react/jsx-pascal-case': 1,
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/no-danger': 1,
    'react/no-deprecated': 1,
    'react/no-did-mount-set-state': 1,
    'react/no-did-update-set-state': 1,
    'react/no-direct-mutation-state': 1,
    'react/no-is-mounted': 1,
    'react/no-multi-comp': 0,
    'react/no-set-state': 1,
    'react/no-string-refs': 0,
    'react/no-unknown-property': 1,
    'react/prefer-es6-class': 1,
    'react/prop-types': 1,
    'react/react-in-jsx-scope': 1,
    'react/self-closing-comp': 1,
    'react/sort-comp': 1,

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
};
