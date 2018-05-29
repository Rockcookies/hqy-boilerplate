const utils = require('./utils');

module.exports = utils.getConfig({
	babelImportOptions: [{
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}],
	extraBabelPlugins: [],

	// Paths
	assetsRoot: '.temp',

	// Styles
	productionSourceMap: true,
	useCssModules: true,
	less: {
		javascriptEnabled: true,
		modifyVars: {
			'@icon-url': '"../../../../../src/assets/fonts/antd/iconfont"',
			'card-actions-background': '#f5f8fa'
		}
	},

	// Alias
	alias: {},

	// Define
	define: {},

	// Dev Server
	devServer: {
		autoOpenBrowser: false,
		proxyTable: {}
	},

	env: {
		development: {
			alias: {
				'app-env': utils.resolve('/src/commons/app-env.dev.ts')
			}
		},
		production: {
			alias: {
				'app-env': utils.resolve('/src/commons/app-env.prod.ts')
			}
		}
	}
});
