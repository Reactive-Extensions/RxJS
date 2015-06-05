var amb = require('./ambproto');
var never = require('./never');

function func(previous, current) {
  return amb(previous, current);
}

/**
 * Propagates the observable sequence or Promise that reacts first.
 * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
 */
module.exports = function () {
  var acc = never(), items = [];
  if (Array.isArray(arguments[0])) {
    items = arguments[0];
  } else {
    var len = arguments.length;
    items = new Array(len);
    for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
  }

  for (var i = 0, len = items.length; i < len; i++) {
    acc = func(acc, items[i]);
  }
  return acc;
};
