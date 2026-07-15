/**
 * Shared Configurations for @/components
 *
 * Provides ESLint, Prettier, TypeScript, Commitlint, and Husky configurations
 * for consistent development across Simple Arab Code projects
 */

// Re-export all configurations for convenience
export { default as eslintBase } from './eslint/base';
export { default as eslintReact } from './eslint/react';
export { default as eslintNext } from './eslint/next';

export { default as prettierConfig } from './prettier';

export { default as commitlintConfig } from './commitlint/commitlint.config';

export { default as huskyHooks } from './husky';
