define(['underscore', 'backbone'], function (_, Backbone) {
	return _.extend(Backbone.View, {
		assign : function (selector, view) {
		    var selectors;
		    if (_.isObject(selector)) {
		        selectors = selector;
		    }
		    else {
		        selectors = {};
		        selectors[selector] = view;
		    }
		    if (!selectors) return;
		    _.each(selectors, function (view, selector) {
		        view.setElement(this.$(selector)).render();
		    }, this);
		}
	})
});