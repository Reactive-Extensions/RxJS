(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */
  QUnit.module('let');

  var Observable = Rx.Observable;

  test('let calls function immediately', function () {
    var called = false;

    Observable.empty()['let'](function (x) {
      called = true;
      return x;
    });

    ok(called);
  });

}());
