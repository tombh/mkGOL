// Marcus Kielly
// list.js
// various methods to help when working with lists (arrays)

define(['underscore', 'lib/number'], function (_, number) {
	
	var module = {};

    module.torusLo = function (position, lo, hi) {
        return (hi - number.difference(position, lo)) + 1; 
    };
    
    module.torusHi = function (position, lo, hi) {
        return (lo + number.difference(position, hi)) - 1;
    };

    module.offsetBound = function (offset, lo, hi) {
        return offset > hi 
            ? hi 
            : offset < lo
                ? lo
                : offset;
    };

    module.offsetTorus = function (position, lo, hi) {
        return number.between(position, lo, hi) 
            ? position 
            : position < lo 
                ? module.torusLo(position, lo, hi)
                : module.torusHi(position, lo, hi);
    };


    module.offset = function (origin, offset, boundary, bound) {
        return bound 
            ? module.offsetBound(origin + offset, 0, boundary) 
            : module.offsetTorus(origin + offset, 0, boundary);
    };

    return module;


});