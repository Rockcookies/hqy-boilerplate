const utils = require('./utils');

module.exports = utils.getConfig({
	// Babel
	extraBabelPlugins: [
		['babel-plugin-import', [{
			libraryName: 'antd',
			libraryName: 'lib',
			style: true
		}]]
	],

	// Typescript
	tsImportPluginOptions: [{
		libraryName: 'antd',
		libraryDirectory: 'lib',
		style: true
	}, {
		style: false,
		libraryName: 'lodash',
		libraryDirectory: null,
		camel2DashComponentName: false
	}, {
		libraryName: 'ant-design-pro',
		libraryDirectory: 'lib',
		style: true,
		camel2DashComponentName: false
	}],

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

	// Commons
	commons: [{
		name: 'vendor',
		minChunks(module) {
			return (
				module.resource &&
				/\.js$/.test(module.resource) &&
				module.resource.indexOf(utils.resolve('node_modules')) === 0
			);
		}
	}, {
		name: 'app',
		async: 'vendor-async',
		children: true,
		minChunks: 3
	}],

	// Define
	define: {
		API_PATH: '/api',
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
		/* proxy: {
			'/api/*': {
				target: 'http://localhost:7001',
				changeOrigin: true
			}
		} */
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
