import path from 'path';
import gulp from 'gulp';
import debug from 'gulp-debug';
import _if from 'gulp-if';

import plumber from './helper/_gulp-plumber';

const log = require('debug')('app:assets');

const parseBuildFiles = () => path.join(gulp.config.src, `?(${gulp.config.scopes.join('|')})`, 'assets', '**/*');
const parseWatchFiles = () => path.join(gulp.config.src, '*', 'assets', '**/*');

// 拷贝资源
gulp.task('assets:build', () => {
	const { config } = gulp;
	const buildFiles = parseBuildFiles();

	log(`building: [${buildFiles}].`);

	return gulp.src(buildFiles)

	// plumber
	.pipe(plumber(log))

	// debug
	.pipe(_if(config.debug, debug({ title: 'ASSETS' })))

	// write files
	.pipe(gulp.dest(config.dest));
});

// 监听资源变化
gulp.task('assets:watch', (next) => {
	const watchFiles = parseWatchFiles();

	log(`watching: [${watchFiles}].`);

	gulp.watch(watchFiles, ['assets:change']);
	next();
});

// 资源变化回调
gulp.task('assets:change', (next) => {
	log('file changed');
	gulp.events.emit('sourcecode:changed', 'assets');
	next();
});
