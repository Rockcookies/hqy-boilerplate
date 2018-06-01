const utils = require('./utils');

module.exports = utils.getConfig({
	// Babel
	extraBabelPlugins: [
		['babel-plugin-import', [
			{ libraryName: 'antd', style: true }
		]]
	],

	// Eslint
	useEslint: true,

	// Paths
	assetsRoot: '.temp',

	// Styles
	browserslist: [
		'>1%',
		'last 4 versions',
		'Firefox ESR',
		'not ie < 9' // React doesn't support IE8 anyway
	],
	productionSourceMap: true,
	useCssModules: true,
	cssModulesExclude: null,
	less: {
		javascriptEnabled: true,
		modifyVars: {
			// '@icon-url': '"../../../../../src/assets/fonts/antd/iconfont"',
			'card-actions-background': '#f5f8fa'
		}
	},
	scss: {},

	// Alias
	alias: {},

	// Define
	define: {
		PORTAL_LOGO: 'Hqy Console',
		PORTAL_COPYRIGHT: `${new Date().getFullYear()} hqy-console framework`,
		PORTAL_LINKS: [{
			key: '1',
			title: '帮助',
			href: ''
		}, {
			key: '2',
			title: '隐私',
			href: ''
		}, {
			key: '3',
			title: '条款',
			href: '',
			blankTarget: true
		}]
	},

	// Dev Server
	devServer: {
		autoOpenBrowser: false,
		disableHostCheck: true,
		proxy: null
	},

	env: {
		development: {
			useEslint: false,
			alias: {
				// 'app-env': utils.resolve('/src/commons/app-env.dev.ts')
			}
		},
		production: {
			useEslint: true,
			alias: {
				// 'app-env': utils.resolve('/src/commons/app-env.prod.ts')
			}
		}
	}
});
