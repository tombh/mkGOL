define(['underscore', 'base', 'config'], function (_, Base, config) {
    var self,
        score = 000000000,
        multiplier = 1,
        defaultScore = 000000000,
        equilibrium = false,
        stagnation = false;

    return Base.Model.extend({
        el : '#score',
        initialize : function () {
            self = this;
            Base.pubSub.on('universe.evolve', this.update, this);
            Base.pubSub.on('ui.reset', this.reset);
            Base.pubSub.on('status.stasis', function (s) {
                if (s) {
                    equilibrium = true;
                } else {
                    stagnation = true;
                }
            });
        },
        update : function () {

            if(!stagnation) {
                if (equilibrium) {
                    multiplier = 2;
                }
                score = score + (multiplier * 1);
                Base.pubSub.trigger('score.update', score);
            }
        },
        reset : function () {
            score = defaultScore;
            stagnation = false;
            equilibrium = false;
            Base.pubSub.trigger('score.reset', score);
        }
    });

});