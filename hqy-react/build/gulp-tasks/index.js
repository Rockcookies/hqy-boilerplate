import gulp from 'gulp';
import path from 'path';
import sequence from 'gulp-sequence';
import del from 'del';
import browserSync from 'browser-sync';
import proxy from 'http-proxy-middleware';

require('./assets.js');
require('./html.js');
require('./styles.js');
require('./js.js');
require('./libs.js');

const serverLog = require('debug')('dev:server');

gulp.task('clean', (next) => {
	del.sync(gulp.config.dest);
	next();
});

gulp.task('dev:watch', (next) => {
	sequence(['assets:watch', 'html:watch', 'styles:watch', 'js:watch'], () => {
		next();
	});
});

gulp.task('dev:serve', ['dev:watch'], (next) => {
	let middleware;

	if (gulp.config.server_proxy) {
		middleware = [];

		for (const serverPath of Object.keys(gulp.config.server_proxy)) {
			middleware.push(proxy(serverPath, gulp.config.server_proxy[serverPath]));
		}
	}

	const serveStatic = gulp.config.all_scopes.map((scope) => ({
		route: `/${scope}/assets`,
		dir: path.join('src', scope, 'assets')
	}));

	const browserSyncInstance = browserSync.init({
		middleware,
		port: gulp.config.server_port,
		startPath: gulp.config.server_index,
		open: gulp.config.server_open,
		notify: false,
		serveStatic,
		server: {
			baseDir: gulp.config.dest
		},
		ghostMode: false
	});

	gulp.events.on('sourcecode:changed', () => {
		serverLog('reloading');
		browserSyncInstance.reload();
	});

	next();
});

