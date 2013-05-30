define(['underscore', 'base', 'lib/gol', 'config'], function (_, Base, gol, config) {

	//PRIVATE METHODS
	var mutateCell = function (row, col) {
			return row[col] ? 0 : 1;
		},
		runAnimation = {
            value : false
        },
        nCellsLive = 0,
		nCellsBorn = 0,
		nCellsAged = 0,
		nCellsDied = 0,
		self;

	return Base.Model.extend({
		defaults :  {
			x : 0,
			y : 0,
			scale : 1,
			cells : [],

		},
		initialize : function () {
			self = this;
			this.set({
				x : config.x ? config.x : 0,
				y : config.y ? config.y : 0,
				cells : this.generate(config.x, config.y)
			});

			Base.pubSub.on('ui.start', this.startLoop, this);
			Base.pubSub.on('ui.stop', this.stopLoop, this);
			Base.pubSub.on('ui.reset', this.reset, this);
			Base.pubSub.on('status.dead', this.stopLoop, this);
			Base.pubSub.on('cursor.click', this.mutate, this);
		},
		generate : function (x, y) {
			// generate a padded array of zeroes
			var cells = _.map(_.range(y), function () {
				return _.map(_.range(x), function () {
					return 0;
				})
			});
			return cells;
		},
		reset : function () {
			this.stopLoop();
			nCellsLive = 0;
			nCellsBorn = 0;
			nCellsAged = 0;
			nCellsDied = 0;

			this.set({
				cells : this.generate(config.x, config.y)
			});

			Base.pubSub.trigger('universe.reset');
		},
		mutate : function (cursor) {
			// alters a single cell in the universe data
			var scale = this.get('scale'),
				cells = this.get('cells'),
				col = cursor.x / scale,
				row = cursor.y / scale,
				msg = false;

			// only call this if the value is in range
			if (col <= this.get('x') && row <= this.get('y')) {

				if (!_.isArray(cells[row])) {
					// initialise the row if it does not exist
					cells[row] = [];
				}

				cells[row][col] = mutateCell(cells[row], col);

				this.set({
					cells : cells,
					silent : true
				});

				// construct message to pass to subscribers
				msg = {
					col : col,
					row : row,
					state : cells[row][col]
				};

			}
			Base.pubSub.trigger('universe.mutate', msg);
		},
		evolve : function () {

			var startState = this.get('cells'),
				nextState = [],
				nextCellState;

			nextState = _.map(startState, function (currentRow) {
				row = arguments[1];
				return _.map(currentRow, function (currentCell) {

					col = arguments[1];

					nextCellState = gol.resolve(
						currentCell,
						gol.findLive(row, col, startState, config.bound)
						) ? 1 : 0;

					// this value is a hash of n* value tickers in initialize
					self.updateStatus(row, col, nextCellState, startState);

					return nextCellState;
				});
			});

			this.set({
				cells : nextState
			});

			Base.pubSub.trigger('universe.evolve', nextState, self.getStatus());
			self.resetStatus();

		},
		startLoop : function () {
			runAnimation.value = true;
			self.loop();
		},
		stopLoop : function () {
			runAnimation.value = false;
			self.loop();
		},
		loop : function () {
            if(runAnimation.value) {
                requestFrame(function () {
                	self.evolve();
                	self.loop();
                });
            }
        },
        getStatus : function () {
        	return {
        		nCellsLive : nCellsLive,
				nCellsBorn : nCellsBorn,
				nCellsAged : nCellsAged,
				nCellsDied : nCellsDied
        	}
        },
        resetStatus : function () {
        	nCellsLive = 0;
        	nCellsDied = 0;
        	nCellsAged = 0;
        	nCellsBorn = 0;
        },
		updateStatus : function (row, col, cellStatus, startState) {

			if(cellStatus) {
				// record total number of live cells
				nCellsLive++;
				// if it was alive before, it has aged
				if(startState[row][col]) {
					nCellsAged++;
				} else {
					// otherwise, it was just born
					nCellsBorn++;
				}
			}

			// record cells that have newly died
			if(!cellStatus && startState[row][col]) {
				nCellsDied++;
			}

		}
	});



});