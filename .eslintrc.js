module.exports = {
	"parser"  : "babel-eslint",
	"extends": "airbnb",

	"env" : {
		"browser" : true
	},

	"rules": {
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
		"import/no-unresolved": 0,
		"import/extensions": 0,
		"import/prefer-default-export": 0,
		"import/no-extraneous-dependencies": 0,
		"prefer-const": 1,
		"consistent-return": 0,
		"max-len": [1, {"code": 200, "tabWidth": 4, "ignoreUrls": true}],
		"no-param-reassign": 0,
		"func-names": 0,
		"arrow-parens": 0,
		"generator-star-spacing": 0,

		"jsx-a11y/no-static-element-interactions": 0,
		"jsx-a11y/img-has-alt": 0,

		"react/forbid-prop-types": [0],
		"react/jsx-indent": [2, 'tab'],
		"react/jsx-indent-props": [2, 'tab'],
		"react/prefer-stateless-function": 0,
		"react/require-default-props": 0,
		"react/no-unused-prop-types": 1
	},

	"parserOptions": {
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true
		}
	}
};
