'use strict'
const merge = require('webpack-merge')
const config = require('./index');

module.exports = merge({
	NODE_ENV: '"production"'
}, config.build.define)
