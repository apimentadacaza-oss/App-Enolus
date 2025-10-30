// .eslintrc.js
module.exports = {
  // Base configuration for the project
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // For new JSX transform
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true, // For scripts
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // General project-wide rules can be relaxed or configured here.
    '@typescript-eslint/no-var-requires': 'warn', // Allow require in JS files like scripts
    '@typescript-eslint/no-explicit-any': 'off', // The project uses `any` in some places, turning this off for now.
  },
  // The `overrides` section is where we apply the strict i18n rule only to specific files.
  overrides: [
    {
      // Apply the strict i18n rules ONLY to these files.
      // These are the core application/UI files.
      files: [
        './App.tsx',
        './components/**/*.tsx',
        './pages/**/*.tsx',
        './features/**/*.tsx',
        './features/**/*.ts', // Also check ts files in features
      ],
      // Inherit the error-level rules from our dedicated i18n config file.
      extends: ['./.eslintrc.i18n.js'],
    },
    {
      // For JS files (like scripts), disable rules that are TS-specific.
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      }
    }
  ],
};
