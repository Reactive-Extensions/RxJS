if (!!window.WeakSet && typeof window.WeakSet.prototype.forEach === 'function') {
  (function () {
    QUnit.module('ToWeakSet');

    var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

    function extractValues(x) {
      var arr = [];
      x.forEach(function (key, value) {
        arr.push(item);
      });
      return arr;
    }

    function createLineItem(text) {
      var li = document.createElement('li');
      li.textContent = text;
      return li;
    }

    test('ToWeakSet_Completed', function () {
      var scheduler = new TestScheduler();
      
      var l1 = createLineItem(1),
          l2 = createLineItem(2),
          l3 = createLineItem(3),
          l4 = createLineItem(4),
          l5 = createLineItem(5);

      var xs = scheduler.createHotObservable(
        onNext(110, l1), 
        onNext(220, l2), 
        onNext(330, l3), 
        onNext(440, l4), 
        onNext(550, l5), 
        onCompleted(660)
      );
      
      var results = scheduler.startWithCreate(function () {
        return xs.toWeakSet().map(extractValues);
      });
      
      results.messages.assertEqual(
        onNext(660, [l2,l3,l4,l5]),
        onCompleted(660)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('ToWeakSet_Error', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var l1 = createLineItem(1),
          l2 = createLineItem(2),
          l3 = createLineItem(3),
          l4 = createLineItem(4),
          l5 = createLineItem(5);

      var xs = scheduler.createHotObservable(
        onNext(110, l1), 
        onNext(220, l2), 
        onNext(330, l3), 
        onNext(440, l4), 
        onNext(550, l5), 
        onError(660, error)
      );
      
      var results = scheduler.startWithCreate(function () {
        return xs.toWeakSet().map(extractValues);
      });
      
      results.messages.assertEqual(
        onError(660, error)
      );
      
      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('ToWeakSet_Disposed', function () {
      var scheduler = new TestScheduler();
      
      var l1 = createLineItem(1),
          l2 = createLineItem(2),
          l3 = createLineItem(3),
          l4 = createLineItem(4),
          l5 = createLineItem(5);

      var xs = scheduler.createHotObservable(
        onNext(110, l1), 
        onNext(220, l2), 
        onNext(330, l3), 
        onNext(440, l4), 
        onNext(550, l5)
      );
      
      var results = scheduler.startWithCreate(function () {
        return xs.toWeakSet().map(extractValues);
      });
      
      results.messages.assertEqual();
      
      xs.subscriptions.assertEqual(
        subscribe(200, 1000)
      );
    });
  }());    
}


