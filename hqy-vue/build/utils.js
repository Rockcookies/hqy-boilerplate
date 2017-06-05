/* eslint-disable */
var path = require('path');
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
	options = options || {}

	var cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: options.sourceMap
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) {
		var loaders = [cssLoader]
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: loaders,
				fallback: 'vue-style-loader'
			})
		} else {
			return ['vue-style-loader'].concat(loaders)
		}
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	var output = []
	var loaders = exports.cssLoaders(options)
	for (var extension in loaders) {
		var loader = loaders[extension]
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		})
	}
	return output
}

exports.getEntries = function () {
	var entries = {};

	Object.keys(config.build.entries).forEach((name) => {
		entries[name] = config.build.entries[name].path;
	});

	return entries;

	//var entries = {};

	// var glob = require('glob');
	// glob.sync('src/**/*.main.js').forEach(function (name) {
	// 	var key = path.relative('src', path.resolve(name)).replace(/\\/g, '/');
	// 	var suffix = '';

	// 	key = key.replace(/\.(main).js$/, ($1, $2) => {
	// 		suffix = `.${$2}`;
	// 		return '';
	// 	});

	// 	entries[key] = `./src/${key}${suffix}.js`;
	// });

	// return entries;
};

exports.getHtmlPlugins = function (conf) {
	var plugins = [];
	var entries = config.build.entries;

	Object.keys(entries).forEach((name) => {
		var entry = entries[name];
		var options = Object.assign({}, conf || {}, entry.html);

		plugins.push(new HtmlWebpackPlugin(options));
	});

	return plugins;

	/* var entries = getEntries();
	var plugins = [];

	Object.keys(entries).forEach((name) => {
		var pagePath = name.replace(/\\/g, '/');

		var conf = {
			__name__: name,
			filename: `${pagePath}.html`, // output path
			template: `src/${pagePath}.main.html`,
			inject: true,
			excludeChunks: Object.keys(entries).filter(_name => (_name != name))
		};

		plugins.push(conf);
	});

	return plugins;*/
};
