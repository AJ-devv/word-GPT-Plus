module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    'plugin:prettier/recommended' // ✅ actively enforces Prettier
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // ✅ Enables proper Vue indentation checking
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': ['error', { singleline: 3 }],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off', // ✅ Disable v-html linting project-wide

    // ✅ Show unused variables as warnings
    '@typescript-eslint/no-unused-vars': 'warn',

    // ✅ Make Prettier formatting errors show in Problems panel
    'prettier/prettier': 'off',

    // ✅ Dev-time freedom for console logs
    'no-console': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off'
      }
    }
  ],
  ignorePatterns: ['src/**/*.d.ts']
}
