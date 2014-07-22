QUnit.module('From');

test('From Array', function () {
  var enumerableFinite = [1, 2, 3, 4, 5];
  
  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, null, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(206)
  );  
});

test('From Array Empty', function () {
  var enumerableFinite = [];
  
  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, null, null, scheduler);
  });

  results.messages.assertEqual(
    onCompleted(201)
  );
});

test('From With Length', function () {
  var enumerableFinite = { length: 5 }

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, function (v, k) { return k; }, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 0),
    onNext(202, 1),
    onNext(203, 2),
    onNext(204, 3),
    onNext(205, 4),
    onCompleted(206)
  ); 
});

test('From With String', function () {
  var enumerableFinite = 'foo';

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, null, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 'f'),
    onNext(202, 'o'),
    onNext(203, 'o'),
    onCompleted(204)
  ); 
});

test('From With Selector', function () {
  var enumerableFinite = [1,2,3];

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, function (x) { return x + x; }, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 2),
    onNext(202, 4),
    onNext(203, 6),
    onCompleted(204)
  ); 
});

test('From With Selector Error', function () {
  var enumerableFinite = [1,2,3];
  var error = new Error('woops');

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, function (x) { throw error; }, null, scheduler);
  });

  results.messages.assertEqual(
    onError(201, error)
  ); 
});

test('From With Selector Some Error', function () {
  var enumerableFinite = [1,2,3];
  var error = new Error('woops');

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, function (x, i) { 
      if (i > 1) { throw error; }
      return x + x; 
    }, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 2),
    onNext(202, 4),
    onError(203, error)
  ); 
});

test('From With Selector And Context', function () {
  var enumerableFinite = [1,2,3];
  var context = 42;

  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.from(enumerableFinite, function (x) { 
      equal(this, context);
      return x + x; 
    }, context, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 2),
    onNext(202, 4),
    onNext(203, 6),
    onCompleted(204)
  ); 
});

// Shim in iterator support
var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
  '_es6shim_iterator_';
// Bug for mozilla version
if (window.Set && typeof new window.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

// Check for Map
if (!!window.Map && new window.Map()[$iterator$] !== undefined) {
  test('From With Map', function () {
    var enumerableFinite = new Map([[1, 2], [2, 4], [4, 8]]);

    var scheduler = new TestScheduler();
    
    var results = scheduler.startWithCreate(function () {
      return Observable.from(enumerableFinite, null, null, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, [1,2]),
      onNext(202, [2,4]),
      onNext(203, [4,8]),
      onCompleted(204)
    ); 
  });
}

if (!!window.Set && new window.Set()[$iterator$] !== undefined) {
  test('From With Set', function () {
    var enumerableFinite = new Set(['foo','bar','baz']);

    var scheduler = new TestScheduler();
    
    var results = scheduler.startWithCreate(function () {
      return Observable.from(enumerableFinite, null, null, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 'foo'),
      onNext(202, 'bar'),
      onNext(203, 'baz'),
      onCompleted(204)
    ); 
  });  
}