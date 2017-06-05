import gulp from 'gulp';
import debug from 'gulp-debug';
import _if from 'gulp-if';
import path from 'path';

import plumber from './gulp/_gulp-plumber';
import config from '../config';

const log = require('debug')('app:assets');

const files = path.join(config.src, `?(${config.scopes.join('|')})`, 'assets', '**/*');
const allFiles = path.join(config.src, '*', 'assets', '**/*');

// 拷贝资源
gulp.task('assets:build', () => {
	log(`building: [${files}].`);

	return gulp.src(files)

	// plumber
	.pipe(plumber(log))

	// debug
	.pipe(_if(config.debug, debug({ title: 'ASSETS' })))

	// write files
	.pipe(gulp.dest(config.dest));
});

// 监听资源变化
gulp.task('assets:watch', (next) => {
	log(`watching: [${allFiles}].`);

	gulp.watch(allFiles, ['assets:change']);
	next();
});

// 资源变化回调
gulp.task('assets:change', (next) => {
	log(`changed: [${allFiles}].`);

	gulp.events.emit('sourcecode:changed', 'assets');
	next();
});
