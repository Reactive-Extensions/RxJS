function areElementsEqual(expected, actual, comparer) {
  comparer || (comparer = Rx.internals.isEqual);
  if (expected.length !== actual.length) {
    return false;
  }
  for (var i = 0; i < expected.length; i++) {
    if (!comparer(expected[i], actual[i])) { return false; }
  }
  return true;
}

beforeEach(function() {
  this.addMatchers({
    toHaveEqualElements: function() {
      var obs = this.actual;
      var len = arguments.length, expected = new Array(len);
      for (var i = 0; i < len; i++) { expected[i] = arguments[i]; }
      return areElementsEqual(expected, obs);
    }
  });
});
