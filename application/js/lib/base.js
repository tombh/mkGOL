// patches Backbone to add pubsub to entire namespace
// prevents need to patch library directly
define(['underscore', 'backbone'], function (_, Backbone) {
	return _.extend(Backbone, {
		pubSub : _.extend({}, Backbone.Events)
	});	
});