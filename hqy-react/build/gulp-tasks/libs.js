import gulp from 'gulp';
import debug from 'gulp-debug';
import _if from 'gulp-if';
import rename from 'gulp-rename';

import plumber from './helper/_gulp-plumber';

const log = require('debug')('app:libs');

// 拷贝资源
gulp.task('libs:build', () => {
	const files = [];
	const libs = [];

	for (const lib of Object.keys(gulp.config.libs)) {
		const [src, min] = gulp.config.libs[lib];
		libs.push(lib);
		files.push(gulp.config.env === 'development' ? src : min);
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
	.pipe(_if(gulp.config.debug, debug({ title: 'LIBS' })))

	// write files
	.pipe(gulp.dest(gulp.config.dest));
});
