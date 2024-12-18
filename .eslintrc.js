/** @type {import('eslint').Linter.Config} */
export default {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
    },
}
