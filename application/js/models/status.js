define(['underscore', 'base', 'lib/gol', 'config'], function (_, Base, gol, config) {
    var self,
        entropy = 0,
        nLastLiveCells = 0,
        stasis = false,
        pop = false,
        dead = false,
        trackingIteration = 0,
        trackingDuration = 10,
        history = [];

    return Base.Model.extend({
        initialize : function () {
            self = this;
            Base.pubSub.on('universe.evolve', self.resolveStatus, this);
            Base.pubSub.on('ui.reset', self.resetState, this);
            Base.pubSub.on('ui.stop', self.resetState, this);
        },
        hasStasis : function () {
            var states = {},
                s = 0;

            // iterate over the history stack
            _.each(history, function (h) {
                if(_.has(states, h)) {
                    s++;
                } else {
                    states[h]=true;
                }
            });

            return s >= config.status.entropy;
        },
        resetState : function () {
            Base.pubSub.trigger('status.reset');
            nLastLiveCells = 0;
            entropy = 0;
            trackingIteration = 0;
            stasis = false;
            pop = false;
            dead = false;
            history = [];
        },
        resolveDeath : function (statistics) {
            if(statistics.nCellsLive === 0 && !dead) {
                Base.pubSub.trigger('status.dead');
                dead = true;
                self.resetState();
            }
        },
        resolvePopulation : function (statistics) {
            if (statistics.nCellsLive > config.status.pop && !pop) {
                Base.pubSub.trigger('status.population');
                pop = true;
            }
        },
        resolveStasis : function (state) {
            if (entropy > config.status.entropy && !stasis) {
                // start tracking stasis
                if (trackingIteration < trackingDuration) {
                    self.track(state);
                    trackingIteration++;
                } else {
                    if(self.hasStasis()) {
                        // stagnant universe
                        Base.pubSub.trigger('status.stasis', false);
                    } else {
                        // stable universe
                        Base.pubSub.trigger('status.stasis', true);
                    }
                    // prevent further tracking
                    stasis = true;
                }

            }
        },
        resolveStatus : function () {
            var state = arguments[0],
                statistics = arguments[1];

            self.updateEntropy(statistics);
            self.resolveDeath(statistics);
            self.resolveStasis(state);
            self.resolvePopulation(statistics);

            nLastLiveCells = statistics.nCellsLive;

        },
        track : function (state) {
            history.push(hex_md5(JSON.stringify(state)));
        },
        updateEntropy : function (statistics) {
            if (statistics.nCellsLive === nLastLiveCells) {
                entropy++;
            }
        }
    });
});