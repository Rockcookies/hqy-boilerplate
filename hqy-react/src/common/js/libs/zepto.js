require('zepto/src/zepto');
require('zepto/src/ie');
require('zepto/src/event');
require('zepto/src/ajax');

/* require('zepto/src/callbacks');
require('zepto/src/deferred');*/

// outerHeight outerWidth
$.each(['Height', 'Width'], (index, prop) => {
	const fn = `outer${prop}`;

	if ($.fn[fn]) return;

	$.fn[fn] = function () {
		return this.length ? this[0][`offset${prop}`] : undefined;
	};
});
