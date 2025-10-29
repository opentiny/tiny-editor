import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
    typescript: true,
    vue: true,
    regexp: false,
    ignores: [
      'dist',
      'node_modules',
      '.github',
    ],
  },
  {
    rules: {
      'eol-last': 'error',
      'no-trailing-spaces': 'error',
      'comma-style': ['error', 'last'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multi-spaces': 'error',
      'quotes': [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      'camelcase': ['error', { properties: 'never' }],
      'object-curly-spacing': ['error', 'always'],

      'ts/no-unused-vars': 'off',
      'ts/explicit-module-boundary-types': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-var-requires': 'off',
      'ts/no-this-alias': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/no-empty-function': 'off',
      'ts/no-use-before-define': 'off',
      'ts/no-unsafe-function-type': 'off',

      'vue/multi-word-component-names': 'off',

      'node/prefer-global/process': 'off',

      'no-restricted-globals': 'off',
      'eqeqeq': 'off',
      'no-new': 'off',
      'no-new-func': 'off',
      'no-alert': 'off',
      'prefer-promise-reject-errors': 'off',

      'antfu/if-newline': 'off',

      'command/command': 'off',

      'unused-imports/no-unused-vars': 'off',

      'unicorn/no-new-array': 'off',
    },
  },
)
