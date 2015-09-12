(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, Rx, equal, start, asyncTest */

  if (typeof Array.observe === 'function') {
    QUnit.module('ofArrayChanges');

    var Observable = Rx.Observable;

    asyncTest('ofArrayChanges captures update', function () {
      var arr = [1,2,3];

      var source = Observable.ofArrayChanges(arr);

      source.subscribe(function (x) {
        equal(x.type, 'splice');
        equal(x.index, 3);
        equal(x.addedCount, 1);
        start();
      });

      arr.push(42);
    });
  }

}());
