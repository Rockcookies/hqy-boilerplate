/* eslint-disable operator-linebreak */
const appConfig = require('./app-config');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const paths = require('./paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer')({
	browsers: appConfig.browserslist,
	flexbox: 'no-2009'
});

const flexBugFixes = require('postcss-flexbugs-fixes')();

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = appConfig.productionSourceMap;

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
	? // Making sure that the publicPath goes back to to build folder.
	{ publicPath: Array(cssFilename.split('/').length).join('../') }
	: {};

// eslint loader
// TODO: Disable require.ensure as it's not a standard language feature.
// We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
// { parser: { requireEnsure: false } },

// First, run the linter.
// It's important to do this before Babel processes the JS.
const eslintLoaderDev = appConfig.useEslint && {
	test: /\.(js|jsx|mjs)$/,
	enforce: 'pre',
	use: [
		{
			options: {
				formatter: eslintFormatter,
				eslintPath: require.resolve('eslint'),
				emitWarning: true
			},
			loader: require.resolve('eslint-loader')
		}
	],
	include: paths.appSrc
};
const eslintLoaderProd = eslintLoaderDev;

// js loader
const jsLoaderDev = {
	test: /\.(js|jsx|mjs)$/,
	include: paths.appSrc,
	loader: require.resolve('babel-loader'),
	options: {
		// This is a feature of `babel-loader` for webpack (not Babel itself).
		// It enables caching results in ./node_modules/.cache/babel-loader/
		// directory for faster rebuilds.
		cacheDirectory: true,
		babelrc: false,
		presets: [require.resolve('babel-preset-react-app')],
		plugins: appConfig.extraBabelPlugins,
		compact: true
	}
};
const jsLoaderProd = jsLoaderDev;

// postcss loader
const postcssLoader = {
	loader: require.resolve('postcss-loader'),
	options: {
		// Necessary for external CSS imports to work
		// https://github.com/facebookincubator/create-react-app/issues/2677
		// don't need now
		// ident: 'postcss',
		plugins: () => [
			flexBugFixes,
			autoprefixer
		]
	}
};

const moduleCssExclude = (filePath) => {
	if (/node_modules/.test(filePath)) {
		return true;
	}

	if (appConfig.cssModulesExclude && appConfig.cssModulesExclude(filePath)) {
		return true;
	} else if (/\.module\.(css|less|sass|scss)$/.test(filePath)) {
		return false;
	}

	return true;
};

const generateDevStyleLoader = (test, loaders) => {
	const rawCssLoaderOptions = {
		importLoaders: 1
	};

	const styleLoaders = [
		require.resolve('style-loader'),
		{
			loader: require.resolve('css-loader'),
			options: rawCssLoaderOptions
		}
	].concat(loaders || []);

	// disable CSS Modules
	if (!appConfig.useCssModules) {
		return {
			test,
			use: styleLoaders
		};
	}

	// enable CSS Modules
	const moduleCssLoaders = [
		require.resolve('style-loader'),
		{
			loader: require.resolve('css-loader'),
			options: {
				...rawCssLoaderOptions,
				modules: true,
				localIdentName: '[name]__[local]___[hash:base64:5]'
			}
		}
	].concat(loaders || []);

	return {
		test,
		oneOf: [{
			exclude: moduleCssExclude,
			use: moduleCssLoaders
		}, {
			use: styleLoaders
		}]
	};
};

const generateProdStyleLoader = (test, loaders) => {
	const rawCssLoaderOptions = {
		importLoaders: 1,
		minimize: true,
		sourceMap: shouldUseSourceMap
	};

	const styleLoaders = ExtractTextPlugin.extract({
		fallback: require.resolve('style-loader'),
		use: [{
			loader: require.resolve('css-loader'),
			options: rawCssLoaderOptions
		}].concat(loaders || []),
		...extractTextPluginOptions
	});

	// disable CSS Modules
	if (!appConfig.useCssModules) {
		return {
			test,
			loader: styleLoaders
		};
	}

	// enable CSS Modules
	const moduleCssLoaders = ExtractTextPlugin.extract({
		fallback: require.resolve('style-loader'),
		use: [{
			loader: require.resolve('css-loader'),
			options: {
				...rawCssLoaderOptions,
				modules: true,
				localIdentName: '[local]___[hash:base64:5]'
			}
		}].concat(loaders || []),
		...extractTextPluginOptions
	});

	return {
		test,
		oneOf: [{
			exclude: moduleCssExclude,
			use: moduleCssLoaders
		}, {
			use: styleLoaders
		}]
	};
};

// css loader
const cssLoaderDev = generateDevStyleLoader(/\.css$/, [postcssLoader]);
const cssLoaderProd = generateProdStyleLoader(/\.css$/, [postcssLoader]);

// scss loader
const scssLoaders = [postcssLoader, {
	loader: 'scss-loader',
	options: appConfig.scss || {}
}];
const scssLoaderDev = generateDevStyleLoader(/\.(sass|scss)$/, scssLoaders);
const scssLoaderProd = generateProdStyleLoader(/\.(sass|scss)$/, scssLoaders);

// less loader
const lessLoaders = [postcssLoader, {
	loader: 'less-loader',
	options: appConfig.less || {}
}];
const lessLoaderDev = generateDevStyleLoader(/\.less$/, lessLoaders);
const lessLoaderProd = generateProdStyleLoader(/\.less$/, lessLoaders);

module.exports = {
	eslintLoaderDev,
	eslintLoaderProd,
	jsLoaderDev,
	jsLoaderProd,
	cssLoaderDev,
	cssLoaderProd,
	scssLoaderDev,
	scssLoaderProd,
	lessLoaderDev,
	lessLoaderProd,
	postcssLoader
};
