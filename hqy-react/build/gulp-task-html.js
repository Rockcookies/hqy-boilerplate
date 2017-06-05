import gulp from 'gulp';
import debug from 'gulp-debug';
import _if from 'gulp-if';
import minifyHtml from 'gulp-minify-html';
import path from 'path';
import through from 'through2';
import gutil from 'gulp-util';
import sequence from 'gulp-sequence';
import ejs from 'ejs';

import plumber from './gulp/_gulp-plumber';
import config from '../config';

const log = require('debug')('app:html');

const files = [
	path.join(config.src, `?(${config.scopes.join('|')})`, 'html', '**/*.html'),
	path.join(config.src, '*.html')
];
const allFiles = [
	path.join(config.src, '*', 'html', '**/*'),
	path.join(config.src, '*.html')
];

function gulpEjs(opts = {}) {
	return through.obj(function (file, enc, cb) {
		// 只允许html文件
		if (file.isNull() || path.extname(file.path) !== '.html') {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-ejs', 'Streaming not supported'));
		}

		const options = {
			...opts
		};

		options.filename = file.path;

		if (!options.ctx) {
			const src = path.resolve(config.src);
			const dirname = path.dirname(file.path);
			const relativePath = path.relative(dirname, src);
			options.ctx = relativePath.replace(/\\/g, '/');

			if (!options.ctx) {
				options.ctx = '.';
			}
			/*
			const srcHtml = path.resolve(config.src_html);
			const destHtml = path.resolve(config.dest_html);
			const destRoot = path.resolve(config.dest_root);

			const destRelativePath = path.resolve(destHtml, path.relative(srcHtml, file.path));

			options.ctx = path.relative(path.dirname(destRelativePath), destRoot);
			options.ctx = options.ctx.replace(/\\/g, '/');

			if (!options.ctx) {
				options.ctx = '.';
			}
			*/
		}

		try {
			file.contents = new Buffer(ejs.render(file.contents.toString(), options));
			// file.path = gutil.replaceExtension(file.path, '.html');
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
		}
		this.push(file);
		cb();
	});
}

// 编译HTML文件
gulp.task('html:build', () => {
	log(`building: [${files}].`);

	return gulp.src(files)

	// plumber
	.pipe(plumber(log))

	// ejs
	.pipe(gulpEjs(config.ejs.options))

	// debug
	.pipe(_if(config.debug, debug({ title: 'HTML' })))

	// minify
	.pipe(_if(config.compile_html_minify, minifyHtml({
		empty: true,
		spare: true,
		quotes: true
	})))

	// write file
	.pipe(gulp.dest(config.dest));
});

// 监听HTML文件
gulp.task('html:watch', (next) => {
	log(`watching: [${allFiles}}.`);
	gulp.watch(allFiles, ['html:change']);
	next();
});

// 监听HTML文件回调
gulp.task('html:change', (next) => {
	sequence('html:build', () => {
		log(`changed: [${allFiles}].`);
		gulp.events.emit('sourcecode:changed', 'html');
		next();
	});
});
