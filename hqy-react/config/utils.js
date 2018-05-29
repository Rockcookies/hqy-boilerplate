const path = require('path');

exports.resolveDefs = function(stringified, defs) {
	const output = {
		...stringified
	};

	output['process.env'] = output['process.env'] || {};

	for (const key in (defs || {})) {
		output['process.env'][key] = JSON.stringify(defs[key]);
	}

	return output;
};

exports.getConfig = function(appConfig) {
	const env = process.env.NODE_ENV;
	const config = { ...appConfig };
	const envConfig = (config.env && config.env[env]) || {};

	const arrOptions = ['extraBabelPlugins'];
	const objOptions = ['alias', 'define'];

	const newConfig = {};

	for (const key in config) {
		if (arrOptions.indexOf(key) >= 0) {
			newConfig[key] = [...(config[key] || []), ...(envConfig[key] || [])];
		} else if (objOptions.indexOf(key)  >= 0) {
			newConfig[key] = {
				...(config[key] || {}),
				...(envConfig[key] || {})
			};
		} else if (key !== 'env') {
			newConfig[key] = envConfig[key] !== undefined ? envConfig[key] : config[key];
		}
	}

	return newConfig;
};

exports.resolve = (p) => {
	return path.join(__dirname, '../', p);
};


