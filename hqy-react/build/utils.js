'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageConfig = require('../package.json')
const webpackHotDevClient = require.resolve('react-dev-utils/webpackHotDevClient')

exports.assetsPath = function (_path) {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory

	return path.posix.join(assetsSubDirectory, _path)
}

function cssLoaders(name, options, loaderOptions) {
	options = options || {}

	const cssLoader = {
		loader: 'css-loader',
		options: {
			importLoaders: 1,
			sourceMap: options.sourceMap,
			...(options.cssModules ? {
				modules: true,
				localIdentName: process.env.NODE_ENV === 'production' ? '[local]___[hash:base64:5]' : '[name]__[local]___[hash:base64:5]'
			} : {})
		}
	}

	const postcssLoader = {
		loader: 'postcss-loader',
		options: {
			sourceMap: options.sourceMap
		}
	}

	const loaders = options.extract ? [cssLoader] : ['style-loader', cssLoader]

	if (options.usePostCSS) {
		loaders.push(postcssLoader)
	}

	if (name !== 'css') {
		loaders.push({
			loader: name + '-loader',
			options: {
				...loaderOptions,
				sourceMap: options.sourceMap
			}
		})
	}

	// Extract CSS when that option is specified
	// (which is the case during production build)
	if (options.extract) {
		return ExtractTextPlugin.extract({
			use: loaders,
			fallback: 'style-loader'
		})
	} else {
		return loaders
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	function exclude(filePath) {
		if (/node_modules/.test(filePath)) {
			return true;
		}

		return false;
	}

	return [{
		test: /\.css$/,
		exclude,
		use: cssLoaders('css', options)
	}, {
		test: /\.css$/,
		include: /node_modules/,
		use: cssLoaders('css', {
			...options,
			cssModules: false
		})
	}, {
		test: /\.less$/,
		exclude,
		use: cssLoaders('less', options, {
			javascriptEnabled: true
		})
	}, {
		test: /\.less$/,
		include: /node_modules/,
		use: cssLoaders('less', {
			...options,
			cssModules: false
		}, {
			javascriptEnabled: true
		})
	}]
}

exports.createNotifierCallback = () => {
	const notifier = require('node-notifier')

	return (severity, errors) => {
		if (severity !== 'error') return

		const error = errors[0]
		const filename = error.file && error.file.split('!').pop()

		notifier.notify({
			title: packageConfig.name,
			message: severity + ': ' + error.name,
			subtitle: filename || '',
			icon: path.join(__dirname, 'logo.png')
		})
	}
}

exports.getEntries = function (options) {
	options = options || {}
	const entries = {};

	Object.keys(config.build.entries).forEach((name) => {
		const entryPath = config.build.entries[name].path;
		entries[name] = options.hmr ? [webpackHotDevClient, entryPath] : entryPath;
	});

	return entries;
}

exports.getHtmlPlugins = function (conf) {
	const plugins = [];
	const entries = config.build.entries;

	Object.keys(entries).forEach((name) => {
		const entry = entries[name];
		const options = Object.assign({}, conf || {}, entry.html);

		plugins.push(new HtmlWebpackPlugin(options));
	});

	return plugins;
}

