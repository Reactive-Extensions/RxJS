(function (window, undefined) {

  var freeExports = typeof exports == 'object' && exports,
    freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
    freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    window = freeGlobal;
  }

  var comparer = Rx.internals.isEqual;

  var slice = Array.prototype.slice;

  function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
  }

  Array.prototype.assertEqual = function () {
    var actual = slice.call(arguments);
    var expected = this;

    var i, isOk = true;
    if (expected.length !== actual.length) {
      ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      return;
    }
    for (i = 0; i < expected.length; i++) {
      isOk = comparer(expected[i], actual[i]);
      if (!isOk) {
        break;
      }
    }
    ok(isOk, createMessage(actual, expected));
  };
}(this));
