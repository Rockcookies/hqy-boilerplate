// https://github.com/michael-ciniawsky/postcss-load-config

const pkg = require('./package.json')

module.exports = {
	"plugins": {
		"postcss-import": {},
		"postcss-url": {},
		// to edit target browsers: use "browserslist" field in package.json
		"autoprefixer": {
			browsers: pkg.browserslist,
			flexbox: 'no-2009'
		}
	}
}
