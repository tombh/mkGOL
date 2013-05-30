define(['underscore', 'base', 'config'], function (_, Base, config) {
    var self;
	return Base.View.extend({
		el : $('#universe'),
        initialize : function () {
            var dimensions = {
                width : config.x * config.scale,
                height : config.y * config.scale
            };
            self = this;
            // redefine canvas properties from config
            this.$el.css(dimensions);
            this.$el.attr(dimensions);

            this.ctx = this.el.getContext('2d');
            this.ctx.fillStyle = config.theme.cell.alive;

            Base.pubSub.on('universe.mutate', this.mutate, this);
            Base.pubSub.on('universe.evolve', this.render, this);
            Base.pubSub.on('universe.reset', this.reset, this);

        },
        mutate : function (o) {
            var x = o.col * config.scale,
                y = o.row * config.scale,
                s = config.scale;

            if (o.state) {
                this.ctx.fillRect(x, y, s, s);
             } else {
                this.ctx.clearRect(x, y, s, s);
             }
        },
        reset : function () {
            var s = config.scale,
                x = self.model.get('x') * s,
                y = self.model.get('y') * s;

            self.ctx.clearRect(0, 0, x, y);
        },
        render : function () {
            var cells = self.model.get('cells'),
                s = config.scale;

            self.reset();

            _.each(cells, function (row, iRow) {
                _.each(row, function (cell, iCol) {
                    if(cell) {
                        self.ctx.fillRect(iCol * s, iRow * s, s, s);
                    }
                })
            });
        }
    });

});
