import gulp from 'gulp';
import sequence from 'gulp-sequence';
import path from 'path';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

import plumber from './helper/_gulp-plumber';
import webpackConfig from '../webpack/webpack-config';

const log = require('debug')('app:js');

const parseBuildDir = () => path.join(gulp.config.src, `?(${gulp.config.scopes.join('|')})`, 'js');
const parseWatchFiles = () => path.join(gulp.config.src, '*', 'js', '**/*');

const build = (src) => {
	log(`building: ${src}`);

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// webpack
	.pipe(webpackStream(webpackConfig(src, gulp.config), webpack))

	// write files
	.pipe(gulp.dest(gulp.config.dest));
};

// 预编译js文件
gulp.task('js:pre', () => {
	const dir = parseBuildDir();

	return build([
		path.join(dir, '**/*.pre.js'),
		path.join(dir, `**/*.${gulp.config.env === 'development' ? 'dev' : 'prod'}.js`)
	]);
});

// 编译js文件
gulp.task('js:build', () => build(path.join(parseBuildDir(), '**/*.main.js')));

// 监听js文件
gulp.task('js:watch', (next) => {
	const watchFiles = parseWatchFiles();

	log(`watching: [${watchFiles}].`);
	gulp.watch(watchFiles, ['js:change']);
	next();
});

// 监听js文件编译回调
gulp.task('js:change', (next) => {
	sequence('js:build', () => {
		log('file changed');
		gulp.events.emit('sourcecode:changed', 'js');
		next();
	});
});
