'use strict';

var isEqual = require('../internal/isequal');

function createMessage(actual, expected) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

module.exports = function assertEqual (t, expected, actual) {
  var i, isOk = true;
  if (expected.length !== actual.length) {
    return t.ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
  }
  for (i = 0; i < expected.length; i++) {
    var e = expected[i], a = actual[i];
    // ALlow for predicates
    if (e.value && typeof e.value.predicate === 'function') {
      isOk = e.time === a.time && e.value.predicate(a.value);
    } else {
      isOk = isEqual(e, a);
    }

    if (!isOk) {
      break;
    }
  }
  t.ok(isOk, createMessage(actual, expected));
};
