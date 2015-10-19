'use strict';

/**
 * Supports push-style iteration over an observable sequence.
 */
function Observer () { }

Observer.addToObject = function (operators) {
  operators.forEach(function (operator) {
    Observer[operator] = operator[operator];
  });
};

Observer.addToPrototype = function (operators) {
  operators.forEach(function (operator) {
    Observer.prototype[operator] = function () {
      var args = [this];
      args.push.apply(args, arguments);
      return operators[operator].apply(null, args);
    };
  });
};

module.exports = Observer;
