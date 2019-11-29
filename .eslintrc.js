module.exports = {
  root: true,

  env: {
    node: true
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'vue/max-attributes-per-line': ['error', {
      singleline: 3,

      multiline: {
        max: 2,
        allowFirstLine: true
      }
    }],

    'vue/component-name-in-template-casing': ['error', 'kebab-case']
  },

  parserOptions: {
    parser: 'babel-eslint'
  }
}
