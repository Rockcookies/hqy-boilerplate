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

import LessPluginAutoprefix from 'less-plugin-autoprefix';

import plumber from './helper/_gulp-plumber';

const log = require('debug')('app:styles');

const parseBuildDir = () => path.join(gulp.config.src, `?(${gulp.config.scopes.join('|')})`, 'js');
const parseWatchFiles = () => path.join(gulp.config.src, '*', 'js', '**/*');

const parseLessPlugins = () => [
	new LessPluginAutoprefix(gulp.config.less.autoprefix)
];

const build = (src) => {
	const dest = gulp.config.dest;

	log(`building: [${src}].`);

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// source map init
	.pipe(_if(gulp.config.compile_css_map, sourcemaps.init({
		debug: true
	})))// {loadMaps: true}

	// less compile
	.pipe(less({
		strictMath: false,
		banner: (gulp.config.compile_css_minify ? undefined : gulp.config.banner),
		paths: [
			path.resolve(gulp.config.src),
			path.resolve(gulp.config.src_libs),
			path.resolve('node_modules')
		],
		modifyVars: gulp.config.less.modifyVars,
		plugins: parseLessPlugins()
	}))

	// css minify
	.pipe(_if(gulp.config.compile_css_minify, csso({
		restructure: true,
		debug: false,
		comments: false
	})))

	// banner
	.pipe(_if(gulp.config.compile_css_minify, header(gulp.config.banner)))

	// rename
	.pipe(rename((filepath) => {
		filepath.dirname = filepath.dirname.replace(/less/, 'css');
		filepath.basename = filepath.basename.replace(/\.(pre|dev|prod|main)$/, '');
	}))

	// debug
	.pipe(_if(gulp.config.debug, debug({ title: 'LESS' })))

	// write source map
	.pipe(_if(gulp.config.compile_css_map, sourcemaps.write('.')))

	// write files
	.pipe(gulp.dest(dest));
};

// 预编译样式文件
gulp.task('styles:pre', () => {
	const dir = parseBuildDir();

	return build([
		path.join(dir, '**/*.pre.less'),
		path.join(dir, `**/*.${gulp.config.env === 'development' ? 'dev' : 'prod'}.less`)
	]);
});

// 编译样式文件
gulp.task('styles:build', () => build(path.join(parseBuildDir(), '**/*.main.less')));

// 监听样式文件
gulp.task('styles:watch', (next) => {
	const watchFiles = parseWatchFiles();

	log(`watching: [${watchFiles}].`);
	gulp.watch(watchFiles, ['styles:change']);
	next();
});

// 监听样式文件编译回调
gulp.task('styles:change', (next) => {
	sequence('styles:build', () => {
		log('file changed');
		gulp.events.emit('sourcecode:changed', 'styles');
		next();
	});
});
