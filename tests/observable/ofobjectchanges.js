(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, Rx, equal, start, asyncTest */

  if (typeof Object.observe === 'function') {
    QUnit.module('ofObjectChanges');

    var Observable = Rx.Observable;

    asyncTest('ofObjectChanges captures update', function() {
      var obj = {x: 1};

      var source = Observable.ofObjectChanges(obj);

      source.subscribe(function (x) {
        equal(x.type, 'update');
        equal(x.name, 'x');
        equal(x.oldValue, 1);
        start();
      });

      obj.x = 42;
    });
  }

}());
