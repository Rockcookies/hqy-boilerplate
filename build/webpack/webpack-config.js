import webpack from 'webpack';
import TemplatedPathPlugin from 'webpack/lib/TemplatedPathPlugin';
import path from 'path';
import glob from 'glob';

import config from '../../config';

const CONFIG = (() => {
	const webpackConfig = {
		context: path.resolve(config.src),
		target: 'web',
		resolve: {
			alias: {
				Libs: path.resolve(config.src_libs)
			},
			modules: ['node_modules', path.resolve(config.src)]
		}
	};

	// ------------------------------------
	// Bundle Output
	// ------------------------------------
	webpackConfig.output = {
		filename: '[name].js',
		chunkFilename: path.join(config.webpack.chunksDir, '[id].js'),
		path: path.resolve(config.dest)
	};

	if (config.env === 'development') {
		webpackConfig.output = {
			...webpackConfig.output,
			pathinfo: true
		};

		if (config.compile_js_map) {
			webpackConfig.devtool = 'cheap-module-source-map';
			webpackConfig.output.sourceMapFilename = '[file].map';
		}
	} else {
		webpackConfig.output = {
			...webpackConfig.output,
			chunkFilename: path.join(config.webpack.chunksDir, '[id]-[chunkhash].js'),
			pathinfo: false
		};

		if (config.compile_js_map) {
			webpackConfig.devtool = 'source-map';
			webpackConfig.output.sourceMapFilename = '[file].map';
		}
	}

	// ------------------------------------
	// Plugins
	// ------------------------------------
	webpackConfig.plugins = [
		new TemplatedPathPlugin(),
		new webpack.DefinePlugin(config.webpack.define)
	];

	if (config.compile_js_minify) {
		webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
			sourceMap: config.compile_js_map,

			compress: {
				unused: true,
				dead_code: true,
				warnings: false
			},
			/*
			mangle: {
				except: ['$super', '$', 'exports', 'require']
			},
			*/
			output: {
				comments: false
			}
		}));
	}

	webpackConfig.plugins.push(new webpack.BannerPlugin({
		banner: config.banner,
		raw: true,
		entryOnly: true
	}));

	// ------------------------------------
	// Module
	// ------------------------------------
	webpackConfig.module = {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					presets: ['es2015', 'stage-0', 'react'],
					plugins: ['add-module-exports', 'transform-class-properties'],
					env: {
						/* development: {
							plugins: [
							['react-transform', {
								transforms: [{
									transform: 'react-transform-hmr',
									imports: ['react'],
									locals: ['module']
								}, {
									transform: 'react-transform-catch-errors',
									imports: ['react', 'redbox-react']
								}]
							}]
							]
						},
						production: {
							plugins: ['transform-react-remove-prop-types', 'transform-react-constant-elements']
						}*/
					}
				}
			}]
		}, {
			test: /\.tpl$/,
			loader: 'text-loader'
		}]
	};

	return webpackConfig;
})();

export default function (srcFiles) {
	const webpackConfig = {
		...CONFIG
	};

	// ------------------------------------
	// Entry Points
	// ------------------------------------
	let hasEntry = false;
	webpackConfig.entry = {};

	srcFiles = Array.isArray(srcFiles) ? srcFiles : [srcFiles];
	srcFiles.forEach(file => glob.sync(file).forEach((name) => {
		let key = path.relative(config.src, path.resolve(name));
		let suffix;

		key = key.replace(/\.(pre|dev|prod|main).js$/, ($1, $2) => {
			suffix = $2;
			return '';
		});

		webpackConfig.entry[key] = `./${key.replace(/\\/, '/')}.${suffix}.js`;
		hasEntry = true;
	}));

	if (!hasEntry) {
		webpackConfig.entry = [];
	}

	return webpackConfig;
}
