import moment from 'moment';
import path from 'path';
import { argv } from 'yargs';
import _debug from 'debug';
import includes from 'lodash/includes';
import merge from 'lodash/merge';
import sizeof from 'lodash/size';

const log = _debug('app:config');
const debug = !!argv.debug;

const NOW = moment();
const TIMESTAMP = NOW.format('YYYYMMDDHHmmss');

const ENV = process.env.NODE_ENV || 'development';

const GLOBALS = {
	__DEV__: ENV === 'development',
	__PROD__: ENV === 'production'
};

const COMPILE_OPTIONS = ['html_minify', 'css_minify', 'css_map', 'js_minify', 'js_map'];

const BASE_CONFIG = {
	env: ENV,
	globals: GLOBALS,
	debug,

	banner:
`/*
 * author  : HQY
 * date    : ${NOW.format('YYYY-MM-DD HH:mm:ss')}
 * email   : hqy321@gmail.com
*/
`,
	all_scopes: [
		'common' // 公共模块
	],

	libs: {},

	src_libs: 'libs', // 资源目录
	src: 'src',
	dest: undefined, // 发布目录

	server_host: 'localhost', // 域名
	server_port: 3000, // 端口
	server_open: false, // 是否自动打开浏览器
	server_index: '/index.html', // 自动打开浏览器的首页
	server_proxy: null,

	compile_html_minify: false, // 是否开启压缩 html
	compile_css_minify: false, // 是否开启压缩 CSS
	compile_css_map: false, // 是否生成 CSS source map
	compile_js_minify: false, // 是否开启压缩 JS
	compile_js_map: false, // 是否生成 JS source map

	webpack: {
		chunksDir: path.join('common', 'js', '_chunks'),
		define: {
			...GLOBALS,
			'process.env': { NODE_ENV: JSON.stringify(ENV) },
			__FN_MODULE_VERSION__: `"${TIMESTAMP}"`,
			__FN_LIB_VERSION__: '"1"'
		}
	},

	ejs: {
		options: {
			...GLOBALS,
			timestamp: TIMESTAMP,
			imgx: 'http://ued.dev.fn.com/imgx'
		}
	},

	less: {
		modifyVars: {
			timestamp: TIMESTAMP
		},
		autoprefix: {
			browsers: [
				'>1%',
				'last 4 versions',
				'Firefox ESR',
				'not ie < 9', // React doesn't support IE8 anyway
			]
		}
	}
};

// 从参数中初始化项目
(() => {
	const scopes = (argv.scope || '').split(',')
		.map(scope => scope.trim())
		.filter(scope => includes(BASE_CONFIG.all_scopes, scope));

	if (sizeof(scopes)) {
		BASE_CONFIG.scopes = scopes;
	} else {
		BASE_CONFIG.scopes = BASE_CONFIG.all_scopes;
	}
})();

log(`Apply configuration overrides for ENV: [${ENV}], SCOPES: [${BASE_CONFIG.scopes.join(', ')}].`);

// 从参数中初始化输出路径
function parseDest(dest) {
	dest = argv.dest ? argv.dest : dest;

	if (debug) {
		log(`Output destination: [${dest}].`);
	}

	return { dest };
}

// 初始化编译选项
function parseCompileOptions(defaults = {}) {
	let compileOptions = defaults;

	if (argv.compile) {
		const options = argv.compile.split(',')
		.map(option => option.trim())
		.filter(option => includes(COMPILE_OPTIONS, option));

		if (sizeof(options)) {
			const obj = {};

			COMPILE_OPTIONS.forEach((option) => {
				if (includes(options, option)) {
					obj[`compile_${option}`] = true;
				}
			});

			compileOptions = obj;
		}
	}

	if (debug) {
		log(`Compile options: [${JSON.stringify(compileOptions)}].`);
	}

	return compileOptions;
}

function devConfig() {
	const dev = merge({}, BASE_CONFIG, parseDest('.temp/debug'), parseCompileOptions({
		compile_css_map: true,
		compile_js_map: true
	}), {
		webpack: {
			define: {
				// __CSL_API_PATH__: '"/csl"'
			}
		},
		server_proxy: {
			/* '/backend_api': {
				target: 'http://local.csl.com',
				changeOrigin: true,
				pathRewrite: { '^/backend_api': '/csl' }
			}*/
		}
	});

	return dev;
}

function prodConfig() {
	const prod = merge({}, BASE_CONFIG, parseDest('.temp/static'), parseCompileOptions({
		compile_html_minify: true,
		compile_css_minify: true,
		compile_js_minify: true
	}), {
		webpack: {
			define: {
				// __CSL_API_PATH__: '"/csl"'
			}
		}
	});

	return prod;
}

const CONFIG = ENV === 'development' ? devConfig() : prodConfig();

export default CONFIG;
