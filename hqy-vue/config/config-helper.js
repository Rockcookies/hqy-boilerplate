const path = require('path')

exports.parseEntries = function (entryList) {
	const entries = {};

	for (const entry of entryList) {
		const entryName = typeof entry === 'string' ? entry : entry.name;

		const item = {
			path: `./src/pages/${entryName}.js`,
			html: {
				title: entryName,
				filename: `${entryName}.html`,
				template: './src/pages/index.ejs'
			}
		};

		if (entry.html) {
			item.html = {
				...item.html,
				...(entry.html || {})
			};
		}

		entries[entryName] = item;
	}

	for (const entry of Object.keys(entries)) {
		const html = entries[entry].html;
		html.excludeChunks = Object.keys(entries).filter(_entry => (_entry != entry)).concat(html.excludeChunks || []);
	}

	return entries;
};

exports.mergeDefs = function (...args) {
	const result = {};

	for (const item of args) {
		for (const key in item) {
			result[key] = JSON.stringify(item[key]);
		}
	}

	return result;
};

exports.resolveSrc = function (dir) {
	return path.join(__dirname, '../src/', dir)
}
