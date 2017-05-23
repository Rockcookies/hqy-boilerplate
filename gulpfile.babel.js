import gulp from 'gulp';
import path from 'path';
import sequence from 'gulp-sequence';
import del from 'del';
import browserSync from 'browser-sync';
import EventEmitter from 'events';
import proxy from 'http-proxy-middleware';

import config from './config';

const serverLog = require('debug')('app:server');

gulp.events = new EventEmitter();

require('./build/gulp-task-assets');
require('./build/gulp-task-html');
require('./build/gulp-task-styles');
require('./build/gulp-task-js');
require('./build/gulp-task-libs');

gulp.task('clean', (next) => {
	del.sync(config.dest);
	next();
});

gulp.task('build', (next) => {
	const tasks = ['html:build', 'styles:build', 'js:build', 'libs:build'];
	if (!process.env.SERVE_MODE) {
		tasks.unshift('assets:build');
	}

	sequence(tasks, () => {
		next();
	});
});

gulp.task('watch', (next) => {
	sequence(['assets:watch', 'html:watch', 'styles:watch', 'js:watch'], () => {
		next();
	});
});

gulp.task('serve', ['watch'], (next) => {
	let middleware;

	if (config.server_proxy) {
		middleware = [];

		for (const serverPath of Object.keys(config.server_proxy)) {
			middleware.push(proxy(serverPath, config.server_proxy[serverPath]));
		}
	}

	const serveStatic = config.all_scopes.map((scope) => ({
		route: `/${scope}/assets`,
		dir: path.join('src', scope, 'assets')
	}));

	const browserSyncInstance = browserSync.init({
		middleware,
		port: config.server_port,
		startPath: config.server_index,
		open: config.server_open,
		notify: false,
		serveStatic,
		server: {
			baseDir: config.dest
		},
		ghostMode: false
	});

	gulp.events.on('sourcecode:changed', () => {
		serverLog('reloading');
		browserSyncInstance.reload();
	});

	next();
});
