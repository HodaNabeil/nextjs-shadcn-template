/**
 * Shared Prettier configuration for Simple Arab Code projects
 * Provides consistent code formatting across all projects
 */

import type { Config } from 'prettier';

const prettierConfig: Config = {
  // Line settings
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Semicolons and quotes
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // JSX settings
  jsxSingleQuote: false,

  // Trailing commas
  trailingComma: 'all',

  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'always',

  // Prose wrap
  proseWrap: 'preserve',

  // HTML whitespace
  htmlWhitespaceSensitivity: 'css',

  // End of line
  endOfLine: 'lf',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in HTML/JSX
  singleAttributePerLine: false,

  // Plugins and overrides
  plugins: [],
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 100,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 100,
      },
    },
  ],
};

export default prettierConfig;
