'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const helper = require('./config-helper')
const APP_ENV = process.env.APP_ENV || 'local'

const defs = {
	APP_ENV,
	API_PATH: APP_ENV === 'local' ? '/mockdata' : '/api'
};

module.exports = {
	dev: {

		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {},

		// Various Dev Server settings
		host: '0.0.0.0', // can be overwritten by process.env.HOST
		port: 3000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

		// Use Eslint Loader?
		// If true, your code will be linted during bundling and
		// linting errors and warnings will be shown in the console.
		useEslint: false,
		// If true, eslint errors and warnings will also be shown in the error overlay
		// in the browser.
		showEslintErrorsInOverlay: false,

		/**
		 * Source Maps
		 */

		// https://webpack.js.org/configuration/devtool/#development
		devtool: 'cheap-module-eval-source-map',

		cssSourceMap: true,

		cssModules: true,

		// 定义变量
		define: helper.mergeDefs(defs),

		// 定义别名
		resolveAlias: {
			'app-env': helper.resolveSrc('commons/app-env.dev.js')
		}
	},

	build: {
		// Template for index.html
		entries: helper.parseEntries([
			'login',
			'portal'
		]),

		// Paths
		assetsRoot: path.resolve(__dirname, '../.temp'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: '#source-map',

		cssModules: true,

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
		bundleAnalyzerReport: process.env.npm_config_report,

		// 定义变量
		define: helper.mergeDefs(defs),

		// 定义别名
		resolveAlias: {
			'app-env': helper.resolveSrc('commons/app-env.prod.js')
		}
	}
}
