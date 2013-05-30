define(['underscore', 'base', 'config'], function (_, Base, config) {

    var runAnimation = {
            value : false
        },
        tune = document.getElementById('tune'),
        bgPos = 0,
        self;

    return Base.View.extend({
        el : '#feedback',
        initialize : function () {
            self = this;
            Base.pubSub.on('ui.stop', self.stop, this);
            Base.pubSub.on('ui.reset', self.reset, this);
            Base.pubSub.on('status.population', self.start, this);
        },
        start : function () {
            tune.play();
            self.$el.addClass('is-visible');
            runAnimation.value = true;
            self.loop();
        },
        stop : function () {
            tune.pause();
            self.$el.removeClass('is-visible');
            runAnimation.value = false;
            self.loop();
        },
        reset : function () {
            tune.pause();
            this.$el.removeClass('is-visible')
               .css('background-position-x', '0px');
        },
        loop : function () {
            if(runAnimation.value) {
                requestFrame(function () {
                    bgPos++;
                    self.$el.css({
                        'background-position-x' : bgPos
                    })
                    self.loop();
                });
            }
        }
    });

});