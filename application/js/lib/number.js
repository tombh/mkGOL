// Marcus Kielly
// number.js
// some utilities to help when working with numbers
define(['underscore'], function (_) {

	return {
		between : function (position, lo, hi) {
	        return lo < hi && (position >= lo && position <= hi);
	    },
	    difference : function (a, b) {
	        return a < b 
	            ? b - a
	            : a - b;
	    }
	};
});