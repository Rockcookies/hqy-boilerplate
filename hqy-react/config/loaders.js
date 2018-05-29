const config = require('./config');
const paths = require('./paths');
const tsImportPluginFactory = require('ts-import-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer')({
	browsers: [
		'>1%',
		'last 4 versions',
		'Firefox ESR',
		'not ie < 9', // React doesn't support IE8 anyway
	],
	flexbox: 'no-2009',
});

const precss = require('precss')();
const flexBugFixes = require('postcss-flexbugs-fixes')();

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = config.productionSourceMap;

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


// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
const urlLoader = {
	test: /\.(bmp|png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
	loader: require.resolve('url-loader'),
	options: {
		limit: 10000,
		name: 'static/media/[name].[hash:8].[ext]',
	},
};

// js loader
const jsLoader = {
	test: /\.(js|jsx|mjs)$/,
	include: paths.appSrc,
	loader: require.resolve('babel-loader'),
	options: {
		// @remove-on-eject-begin
		babelrc: false,
		presets: [require.resolve('babel-preset-react-app')],
		plugins: [['babel-plugin-import', config.babelImportOptions]],
		// @remove-on-eject-end
		compact: true,
	},
};


// ts loader
const tsLoader = {
	test: /\.(ts|tsx)$/,
	include: paths.appSrc,
	use: [
		{
			loader: require.resolve('ts-loader'),
			options: {
				transpileOnly: true,
				getCustomTransformers: () => ({
					before: [tsImportPluginFactory(config.babelImportOptions)]
				})
			}
		}
	]
};

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
		],
	},
};

const precssLoader = {
	loader: require.resolve('postcss-loader'),
	options: {
		// Necessary for external CSS imports to work
		// https://github.com/facebookincubator/create-react-app/issues/2677
		// don't need now
		// ident: 'postcss',
		plugins: () => [
			precss,
			flexBugFixes,
			autoprefixer
		],
	},
};

const generateDevStyleLoader = (name, loaders) => {
	const test = new RegExp('\\.' + name + '$'); // /\.css$/ /\.less$/ /\.scss$/
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
	if (!config.useCssModules) {
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
			exclude: (filePath) => (/node_modules/.test(filePath) ? true : false),
			use: moduleCssLoaders
		}, {
			include: /node_modules/,
			use: styleLoaders
		}]
	};
}

const generateProdStyleLoader = (name, loaders) => {
	const test = new RegExp('\\.' + name + '$'); // /\.css$/ /\.less$/ /\.scss$/
	const rawCssLoaderOptions = {
		importLoaders: 1,
		minimize: true,
		sourceMap: shouldUseSourceMap,
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
	if (!config.useCssModules) {
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
			exclude: (filePath) => (/node_modules/.test(filePath) ? true : false),
			use: moduleCssLoaders
		}, {
			include: /node_modules/,
			use: styleLoaders
		}]
	};
};

// css loader
const cssLoaderDev = generateDevStyleLoader('css', [postcssLoader]);
const cssLoaderProd = generateProdStyleLoader('css', [postcssLoader]);

// scss loader
const scssLoaderDev = generateDevStyleLoader('scss', [precssLoader]);
const scssLoaderProd = generateProdStyleLoader('scss', [precssLoader]);

// less loader
const lessLoaders = [postcssLoader, {
	loader: require.resolve('less-loader'),
	options: config.less || {}
}];
const lessLoaderDev = generateDevStyleLoader('less', lessLoaders);
const lessLoaderProd = generateProdStyleLoader('less', lessLoaders);

// Exclude `js` files to keep "css" loader working as it injects
// it's runtime that would otherwise processed through "file" loader.
// Also exclude `html` and `json` extensions so they get processed
// by webpacks internal loaders.
const fileLoader = {
	loader: require.resolve('file-loader'),
	// Exclude `js` files to keep "css" loader working as it injects
	// it's runtime that would otherwise processed through "file" loader.
	// Also exclude `html` and `json` extensions so they get processed
	// by webpacks internal loaders.
	exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
	options: {
		name: 'static/media/[name].[hash:8].[ext]',
	},
};

module.exports = {
	urlLoader,
	jsLoader,
	tsLoader,
	cssLoaderDev,
	cssLoaderProd,
	scssLoaderDev,
	scssLoaderProd,
	lessLoaderDev,
	lessLoaderProd,
	fileLoader,
	postcssLoader
};
