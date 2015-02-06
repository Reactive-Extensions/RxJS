(function () {
  if (typeof Object.observe === 'function') {
    QUnit.module('ofObjectChanges');

    var TestScheduler = Rx.TestScheduler,
        Observable = Rx.Observable,
        onNext = Rx.ReactiveTest.onNext,
        onError = Rx.ReactiveTest.onError,
        onCompleted = Rx.ReactiveTest.onCompleted,
        subscribe = Rx.ReactiveTest.subscribe;

    asyncTest('ofObjectChanges captures update', function() {
      var obj = {x: 1};
      var source = Rx.Observable.ofObjectChanges(obj);
      var subscription = source.subscribe(function (x) {
        equal(x.type, 'update');
        equal(x.name, 'x');
        equal(x.oldValue, 1);
        start();
      });

      obj.x = 42;
    });
  }

}());
