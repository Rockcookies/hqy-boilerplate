import path from 'path';
import gulp from 'gulp';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import header from 'gulp-header';
import rename from 'gulp-rename';
import sequence from 'gulp-sequence';
import _if from 'gulp-if';
import debug from 'gulp-debug';
import csso from 'gulp-csso';

import plumber from './gulp/_gulp-plumber';
import config from '../config';

const filesDir = path.join(config.src, `?(${config.scopes.join('|')})`, 'less');
const allFiles = path.join(config.src, '*', 'less', '**/*');

const log = require('debug')('app:styles');

const loadPlugin = (Plugin, options = {}) => new Plugin(options);

const PLUGIN = {
	autoprefix: loadPlugin(require('less-plugin-autoprefix'), config.less.autoprefix)
};

const build = (src) => {
	const dest = config.dest;

	log(`building: [${src}].`);

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// source map init
	.pipe(_if(config.compile_css_map, sourcemaps.init({
		debug: true
	})))// {loadMaps: true}

	// less compile
	.pipe(less({
		strictMath: false,
		banner: (config.compile_css_minify ? undefined : config.banner),
		paths: [
			path.resolve(config.src),
			path.resolve(config.src_libs),
			path.resolve('node_modules')
		],
		modifyVars: config.less.modifyVars,
		plugins: [PLUGIN.autoprefix]
	}))

	// css minify
	.pipe(_if(config.compile_css_minify, csso({
		restructure: true,
		debug: false,
		comments: false
	})))

	// banner
	.pipe(_if(config.compile_css_minify, header(config.banner)))

	// rename
	.pipe(rename((filepath) => {
		filepath.dirname = filepath.dirname.replace(/less/, 'css');
		filepath.basename = filepath.basename.replace(/\.(pre|dev|prod|main)$/, '');
	}))

	// debug
	.pipe(_if(config.debug, debug({ title: 'LESS' })))

	// write source map
	.pipe(_if(config.compile_css_map, sourcemaps.write('.')))

	// write files
	.pipe(gulp.dest(dest));
};

// 预编译样式文件
gulp.task('styles:pre', () => build([
	path.join(filesDir, '**/*.pre.less'),
	path.join(filesDir, `**/*.${config.env === 'development' ? 'dev' : 'prod'}.less`)
]));

// 编译样式文件
gulp.task('styles:build', () => build(path.join(filesDir, '**/*.main.less')));

// 监听样式文件
gulp.task('styles:watch', (next) => {
	log(`watching: [${allFiles}].`);
	gulp.watch(allFiles, ['styles:change']);
	next();
});

// 监听样式文件编译回调
gulp.task('styles:change', (next) => {
	sequence('styles:build', () => {
		gulp.events.emit('sourcecode:changed', 'styles');
		next();
	});
});
