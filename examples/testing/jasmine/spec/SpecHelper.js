var slice = Array.prototype.slice;

function areElementsEqual(expected, actual, comparer) {
    var i, isOk = true;
    comparer || (comparer = Rx.internals.isEqual);
    if (expected.length !== actual.length) {
        return false;
    }
    for (i = 0; i < expected.length; i++) {
        if (!comparer(expected[i], actual[i])) {
            return false;
        }
    }
    return true;
}

beforeEach(function() {
  this.addMatchers({
    toHaveEqualElements: function() {
      var obs = this.actual;
      var expected = slice.call(arguments);
      return areElementsEqual(expected, obs);
    }
  });
});
