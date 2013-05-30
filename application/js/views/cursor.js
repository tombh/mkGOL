define(['underscore', 'base', 'config'], function (_, Base, config) {
    return Base.View.extend({
        el : $('#cursor'),
        initialize : function () {
            var dimensions = {
                width : config.x * config.scale,
                height : config.y * config.scale
            };
            this.ctx      = this.el.getContext('2d');
            this.boundary = this.el.getBoundingClientRect();

            this.lastX = 0;
            this.lastY = 0;

            this.w = config.x * config.scale;
            this.h = config.y * config.scale;

            // redefine canvas properties from config
            this.$el.css(dimensions);
            this.$el.attr(dimensions);

            this.firstDraw = true;
        },
        events : {
            "mousemove"  : "updateCursor",
            "click"      : "emitCursor"
        },
        getQuantizedCursor : function (e) {
            var xy = this.getMousePos(e),
                newX = this.model.quantize(xy[0]),
                newY = this.model.quantize(xy[1]);
            return [newX, newY];
        },
        emitCursor : function (e) {
            var xy = this.getQuantizedCursor(e);
            Base.pubSub.trigger('cursor.click', {
                'x'       : xy[0],
                'y'       : xy[1],
            });
        },
        updateCursor : function (e) {
            var xy = this.getQuantizedCursor(e),
                newX = xy[0],
                newY = xy[1];

            if(newX !== this.lastX || newY !== this.lastY) {
                this.ctx.clearRect (0, 0, this.w, this.h);

                if(newX !== this.lastX && newY !== this.lastY) {
                    // update X and Y
                    this.drawCursor(newX, newY);
                    this.lastX = newX;
                    this.lastY = newY;
                } else if(newX !== this.lastX) {
                    // update X
                    this.drawCursor(newX, this.lastY);
                    this.lastX = newX;
                } else if(newY !== this.lastY) {
                    // update Y
                    this.drawCursor(this.lastX, newY);
                    this.lastY = newY;
                }
                this.firstDraw = false;

            } else if (newX === 0 && newY === 0 && this.lastX === 0 && this.lastY === 0 && this.firstDraw === true) {
                // this to force cursor rendering
                // if user starts at X:0, Y:0
                this.drawCursor(newX, newY);
                this.firstDraw = false;
            }
        },
        drawCursor : function (x, y) {
            // fix mouse position
            this.ctx.fillStyle = 'rgba(0,0,255,0.5)';
            this.ctx.fillRect(x, 0, config.scale, this.h);//x
            this.ctx.fillRect(0, y, this.w, config.scale);//y
        },
        getMousePos : function (evt) {
            var x, y;

            x = (evt.pageX - this.$el.offset().left);
            y = (evt.pageY - this.$el.offset().top);

            return [x, y];

        }
	});
});