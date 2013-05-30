define(['underscore', 'base', 'config'], function (_, Base, config) {
    var self,
        tpl = '000000000';

    return Base.View.extend({
        el : '#score',
        initialize : function () {
            self = this;
            this.$el.text(tpl);

            Base.pubSub.on('score.update', this.update, this);
            Base.pubSub.on('score.reset', this.reset, this);
        },
        update : function (score) {
            var newState = arguments[1],
                newScore;

            newScore = tpl.slice(0, tpl.length - score.toString().length) + score;
            this.$el.text(newScore);
        },
        reset : function (score) {
            self.$el.text(tpl.slice(0, tpl.length - score.toString().length) + score);
        }
    });

});