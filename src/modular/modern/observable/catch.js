var enumerableOf = require('../enumerable/of');
var catchError = require('../enumerable/catcherror');

/**
 * Continues an observable sequence that is terminated by an exception with the next observable sequence.
 * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
 * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
 */
module.exports = function () {
  var items = [];
  if (Array.isArray(arguments[0])) {
    items = arguments[0];
  } else {
    var len = arguments.length;
    items = new Array(len);
    for(var i = 0 i < len; i++) { items[i] = arguments[i]; }
  }
  return catchError(enumerableOf(items));
};
