define(['underscore', 'lib/list', 'lib/number'], function (_, list, number) {
    

    var gol = {};


    gol.delta = function (row, col, cells, bound) {
        // iterate over the required offsets - apply them to row,col
        return _.map([[-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]
            ], function (offset) {
                return [
                    list.offset(row, offset[0], cells.length - 1, bound), 
                    list.offset(col, offset[1], cells[0].length - 1, bound)
                ];
            });
    };
    

    gol.scan = function (row, col, cells, bound) {
        return _.map(
            gol.delta(row, col, cells, bound),
            function (xy) {
                return cells
                    .slice(xy[0], xy[0]+1)[0]
                    .slice(xy[1], xy[1]+1)[0];
            });
    };


    gol.resolve = function (cell, neighbours) {
        return cell === 1 
            ? number.between(neighbours, 2, 3)
            : neighbours === 3
    };



    gol.findLive = function (row, col, cells, bound){
        // retrieve all live cells within the cells surrounding row, col
        var scanned = (bound === true)
            ? gol.scan(row, col, cells, true)
            : gol.scan(row, col, cells, false);
        return _.reduce(scanned, function (memo, num) {
            return memo + num;
        });
    };


    return gol;
});
	
	

	