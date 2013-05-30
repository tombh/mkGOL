define(['underscore', 'base', 'config'], function (_, Base, config) {
    var self;

    return Base.View.extend({
        el : '#status',
        initialize : function () {
            self = this;
            Base.pubSub.on('status.dead', function () {
                self.$el.addClass('dead').text('dead!');
            });
            Base.pubSub.on('status.stasis', function (s) {
                var msg = s ? 'equilibrium' : 'stagnation' ;
                self.$el.addClass(msg).text(msg);
            });
            Base.pubSub.on('status.population', function () {
                self.$el.addClass('population').text('population explosion!');
            });
            Base.pubSub.on('status.reset', function () {
                self.$el.removeClass('dead stagnation equilibrium population').text('');
            });
        }
    });

});