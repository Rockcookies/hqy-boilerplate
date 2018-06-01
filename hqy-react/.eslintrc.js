// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	env: {
		'browser': true,
		'node': true,
		'es6': true,
		'mocha': true,
		'jest': true,
		'jasmine': true
	},
	extends: ['standard', 'standard-react'],
	// add your custom rules here
	rules: {
		// allow async-await
		'generator-star-spacing': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		'indent': [1, 'tab'],
		'semi': ['error', 'always'],
		'no-unused-vars': 1,
		'space-before-function-paren': ['error', 'never'],

		'react/jsx-indent': [1, 'tab'],
		'react/jsx-indent-props': [1, 'tab'],
		'react/no-unused-prop-types': 1
	}
}
