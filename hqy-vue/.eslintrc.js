// http://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	extends: 'airbnb-base',
	// required to lint *.vue files
	plugins: [
	'html'
	],
	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': 'build/webpack.base.conf.js'
			}
		}
	},
	// add your custom rules here
	'rules': {
		"import/no-unresolved": 0,
		"import/prefer-default-export": 0,
		// don't require .vue extension when importing
		'import/extensions': 0,
		// allow optionalDependencies
		'import/no-extraneous-dependencies': ['error', {
			'optionalDependencies': ['test/unit/index.js']
		}],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		"no-tabs": 0,
		"indent": [1, "tab"],
		"no-unused-vars": 1,
		"no-cond-assign": 0,
		"no-else-return": 0,
		"object-shorthand": 0,
		"comma-dangle": 0,
		"no-undef": 0,
		"no-restricted-syntax": 0,
		"no-underscore-dangle": 0,
		"global-require": 0,
		"prefer-const": 1,
		"consistent-return": 0,
		"max-len": [1, {"code": 200, "tabWidth": 4, "ignoreUrls": true}],
		"no-param-reassign": 0,
		"func-names": 0,
		"arrow-parens": 0,
		"generator-star-spacing": 0
	}
}
