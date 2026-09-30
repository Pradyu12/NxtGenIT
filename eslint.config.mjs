import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDirectory = dirname(fileURLToPath(import.meta.url));

/**
 * `eslint-config-next@15` is still published in the legacy eslintrc format, and
 * its bundled rushstack patch does not understand ESLint 9's flat config.
 * `FlatCompat` translates it instead, so we keep modern ESLint and Next's rules
 * (including react-hooks) rather than downgrading the toolchain.
 */
const compat = new FlatCompat({ baseDirectory });

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts', 'build/**'],
  },
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The base rule misreports unused *type* declarations in .ts files
      // (e.g. a parameter name inside a function type). The TypeScript-aware
      // rule below handles real code correctly.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // Function *type* parameters are declarations, not references.
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
];

export default eslintConfig;
