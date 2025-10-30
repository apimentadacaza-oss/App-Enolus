/**
 * @type {import('eslint').Linter.Config}
 * This file contains i18n-related linting rules.
 * It's intended to be used as an override in the main .eslintrc.js file.
 */
module.exports = {
  // Assuming eslint-plugin-react is already installed.
  rules: {
    /**
     * Warns about string literals used in JSX.
     * This encourages using the `t()` function for all user-facing text.
     * We allow certain non-translatable characters and symbols to avoid unnecessary warnings.
     */
    'react/jsx-no-literals': [
      'error',
      {
        noStrings: true,
        // Add any characters/symbols that are safe to be hardcoded.
        allowedStrings: [
            ' ', '.', ',', ':', ';', '(', ')', '[', ']', '{', '}',
            '/', '-', '+', '=', '*', '%',
            '#', '@', '!', '?',
            '→', '✓', '✔', '🔒', '▶', '▶️', '📝', '🎧', '❓', '•', '📜', '—', '›', '›'
        ],
      },
    ],
    /**
     * Warns about unescaped characters like ">" or "}" in JSX,
     * which can break rendering or be a potential security risk.
     */
    'react/no-unescaped-entities': [
      'warn',
      {
        forbid: [
          { char: '>', alternatives: ['&gt;'] },
          { char: '}', alternatives: ['&#125;'] },
        ],
      },
    ],
  },
};