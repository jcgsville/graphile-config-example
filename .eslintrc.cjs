/** @type {import('eslint').Linter.Config} */
module.exports = {
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
        projectService: {
            allowDefaultProject: ['.eslintrc.cjs'],
        },
        tsconfigRootDir: __dirname,
    },
    rules: {
        // Graphile Config uses namespaces heavily
        '@typescript-eslint/no-namespace': 'off',
    },
}
