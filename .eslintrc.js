module.exports = {
  'extends': ['eslint:recommended', 'prettier'],
  'rules': {
    'prettier/prettier': [
      'error', {
        singleQuote: true,
        semi: true
      }
    ]
  },
  'plugins': [
    'prettier'
  ],
  'settings': {
    'ecmascript': 2015
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 6
  },
  'env': {
    'browser': true,
    'node': true,
    'es6': true
  }
};
