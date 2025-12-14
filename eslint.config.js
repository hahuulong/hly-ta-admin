import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default [
    js.configs.recommended,

    // --- chuyển toàn bộ plugin cũ sang flat bằng compat ---
    ...compat.extends('plugin:react/recommended'),
    ...compat.extends('plugin:jsx-a11y/recommended'),
    ...compat.extends('plugin:prettier/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),

    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        plugins: {
            react: reactPlugin,
            '@typescript-eslint': tsPlugin,
            'react-hooks': reactHooks,
            import: importPlugin,
            prettier,
            'jsx-a11y': jsxA11y,
        },

        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
        // nếu trong script để là: eslint . thì phải bật tất cả ignore lên
        ignores: [
            // Thư mục cần loại trừ
            // 'node_modules/**',
            // 'dist/**',
            // 'build/**',
            // 'coverage/**',
            // '.vite/**',
            // '.vscode/**',
            // '.tanstack/**',
            // 'public/**',
            // HTML files
            // '*.html',
            // 'public/**/*.html',
            // Package files
            // 'package.json',
            // 'package-lock.json',
            // 'pnpm-lock.yaml',
            // 'yarn.lock',
            // Markdown docs
            // '*.md',
            // JSON files (nếu muốn giữ tsconfig.json thì xóa dòng này)
            // '*.json',
            // File config (JS/TS)
            // '**/*.config.js',
            // '**/*.config.cjs',
            // '**/*.config.mjs',
            // '*.config.js',
            // '*.config.cjs',
            // '*.config.mjs',
            // .env files
            // '.env',
            // '.env.*',
            // Docker files
            // 'dockerfile',
            // 'dockerfile.*',
            // 'Dockerfile',
            // 'Dockerfile.*',
            // Docker Compose
            // 'docker-compose.yml',
            // 'docker-compose.yaml',
            // 'docker-compose.*.yml',
            // 'docker-compose.*.yaml',
            // Optional meta
            // '*.lock',
        ],
    },
];
