(function () {
  if (typeof Array.observe === 'function') {
    QUnit.module('ofArrayChanges');

    var TestScheduler = Rx.TestScheduler,
        Observable = Rx.Observable,
        onNext = Rx.ReactiveTest.onNext,
        onError = Rx.ReactiveTest.onError,
        onCompleted = Rx.ReactiveTest.onCompleted,
        subscribe = Rx.ReactiveTest.subscribe;

    asyncTest('ofArrayChanges captures update', function() {
      var arr = [1,2,3];
      var source = Rx.Observable.ofArrayChanges(arr);
      var subscription = source.subscribe(function (x) {
        equal(x.type, 'splice');
        equal(x.index, 3);
        equal(x.addedCount, 1);
        start();
      });

      arr.push(42);
    });
  }

}());
