/* eslint-disable */

var path = require('path');

function parseEntries(entries) {
	Object.keys(entries).forEach((name) => {
		var entry = entries[name];

		// path
		entry.path = `./src/${name}.main.js`;

		// html
		var html = entry.html = Object.assign({
			filename: `${name}.html`
		}, entry.html || {});

		if (html.template === true) {
			html.template = `src/${name}.main.html`;
		}

		html.excludeChunks = Object.keys(entries).filter(_name => (_name != name)).concat(html.excludeChunks || []);
	});

	return entries;
};

module.exports = {
	build: {
		entries: parseEntries({
			'common/common': {
				html: { template: true }
			},
			'test/test': {
				html: { template: true }
			}
		}),
		env: require('./prod.env'),
		assetsRoot: path.resolve(__dirname, '../.temp'),
		assetsSubDirectory: 'static',
		// assetsPublicPath: '/',
		productionSourceMap: true,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},

	dev: {
		env: require('./dev.env'),
		port: 3000,
		autoOpenBrowser: false,
		assetsSubDirectory: 'static',
		// assetsPublicPath: '/',
		proxyTable: {},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	}
};

/*console.log(JSON.stringify())*/
