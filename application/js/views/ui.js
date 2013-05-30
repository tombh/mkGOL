// Marcus Kielly
// ui.js
//
// handles interface events

define(['underscore', 'base', 'config'], function (_, Base, config) {

    var self;

    return Base.View.extend({
        el: "#ui",
        initialize : function () {
            self = this;
        },
        events : {
            "click #start" : "start",
            "click #stop" : "stop",
            "click #reset" : "reset",
        },
        start : function (e) {
            e.stopPropagation();
            Base.pubSub.trigger('ui.start');
            return false;
        },
        stop : function (e) {
            e.stopPropagation();
            Base.pubSub.trigger('ui.stop');
            return false;
        },
        reset : function (e) {
            e.stopPropagation();
            Base.pubSub.trigger('ui.reset');
            return false;
        }
    });
});