import gulp from 'gulp';
import debug from 'gulp-debug';
import _if from 'gulp-if';
import rename from 'gulp-rename';

import plumber from './gulp/_gulp-plumber';
import config from '../config';

const log = require('debug')('app:libs');

// 拷贝资源
gulp.task('libs:build', () => {
	const files = [];
	const libs = [];

	for (const lib of Object.keys(config.libs)) {
		const [src, min] = config.libs[lib];
		libs.push(lib);
		files.push(config.env === 'development' ? src : min);
	}

	log(`building: [${files}].`);

	return gulp.src(files)

	// plumber
	.pipe(plumber(log))

	// rename
	.pipe(rename((filepath) => {
		filepath.basename = filepath.basename.replace(/\.(min)$/, '');
		filepath.dirname = `lib/${filepath.basename}`;
	}))

	// debug
	.pipe(_if(config.debug, debug({ title: 'LIBS' })))

	// write files
	.pipe(gulp.dest(config.dest));
});
