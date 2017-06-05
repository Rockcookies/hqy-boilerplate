import gulp from 'gulp';
import sequence from 'gulp-sequence';
import path from 'path';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

import plumber from './gulp/_gulp-plumber';
import webpackConfig from './webpack/webpack-config';
import config from '../config';

const log = require('debug')('app:js');

const filesDir = path.join(config.src, `?(${config.scopes.join('|')})`, 'js');
const allFiles = path.join(config.src, '*', 'js', '**/*');

const build = (src) => {
	log(`building: ${src}`);

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// webpack
	.pipe(webpackStream(webpackConfig(src), webpack))

	// write files
	.pipe(gulp.dest(config.dest));
};

// 预编译js文件
gulp.task('js:pre', () => build([
	path.join(filesDir, '**/*.pre.js'),
	path.join(filesDir, `**/*.${config.env === 'development' ? 'dev' : 'prod'}.js`)
]));

// 编译js文件
gulp.task('js:build', () => build(path.join(filesDir, '**/*.main.js')));

// 监听js文件
gulp.task('js:watch', (next) => {
	log(`watching: [${allFiles}].`);
	gulp.watch(allFiles, ['js:change']);
	next();
});

// 监听js文件编译回调
gulp.task('js:change', (next) => {
	sequence('js:build', () => {
		log(`changed: [${allFiles}].`);
		gulp.events.emit('sourcecode:changed', 'js');
		next();
	});
});
