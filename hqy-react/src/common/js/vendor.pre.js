import dva, { connect } from 'dva';
import regeneratorRuntime from 'regenerator-runtime/runtime';
import Antd from './libs/antd';

const ReactRouter = require('dva/router');

const ReactRouterRedux = ReactRouter.routerRedux;

require('./libs/zepto');

require('babel-polyfill');

window.regeneratorRuntime = regeneratorRuntime;

dva.connect = connect;

const FN = window.FN || {};
window.FN = FN;

FN.Libs = {
	classnames: require('classnames'),
	moment: require('moment'),

	'rc-animate': require('rc-animate'),
	'path-to-regexp': require('path-to-regexp'),

	qs: require('qs'),

	dva,
	react: require('react'),
	'prop-types': require('prop-types'),
	'react-dom': require('react-dom'),
	'redux-saga': require('dva/saga'),
	'react-router': ReactRouter,
	'react-router-redux': ReactRouterRedux,
	antd: Antd
};
