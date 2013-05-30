define(['underscore', 'base'], function (_, Base) {
	return Base.Model.extend({
		defaults : {
			scale : 1
		},
		initialize : function (options) {
			if(_.isObject(options) 
				&& _.has(options, 'scale') 
				&& _.isNumber(options.scale)) {
				this.scale = options.scale; 
			}
		},
		quantize : function (v) {
			var offset = v % this.scale;
			return (offset > 0) ? v - offset : v;
		}
	});
});