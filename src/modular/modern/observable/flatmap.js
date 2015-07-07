var flatmapcore = require('./internal/flatmapcore');
var mergeAll = require('./mergeAll');

module.exports = function(source, selector, resultSelector, thisArg) {
    return mergeAll(flatmapcore(source, selector, resultSelector, thisArg));
};
