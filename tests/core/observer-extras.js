(function () {
  QUnit.module('Observer');

  var Observer = Rx.Observer,
    createOnNext = Rx.Notification.createOnNext,
    createOnError = Rx.Notification.createOnError,
    createOnCompleted = Rx.Notification.createOnCompleted;

  test('ToObserver_NotificationOnNext', function () {
    var i = 0;
    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'N');
      equal(n.value, 42);
      equal(n.exception, null);
    };
    Observer.fromNotifier(next).onNext(42);
  });

  test('ToObserver_NotificationOnError', function () {
    var error = new Error();
    var i = 0;
    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'E');
      equal(n.exception, error);
    };
    Observer.fromNotifier(next).onError(error);
  });

  test('ToObserver_NotificationOnCompleted', function () {
    var i = 0;
    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'C');
    };
    Observer.fromNotifier(next).onCompleted();
  });

  test('ToNotifier_Forwards', function () {
    var obsn = new MyObserver();
    obsn.toNotifier()(createOnNext(42));
    equal(obsn.hasOnNext, 42);

    var error = new Error();
    var obse = new MyObserver();
    obse.toNotifier()(createOnError(error));
    equal(error, obse.hasOnError);

    obsc = new MyObserver();
    obsc.toNotifier()(createOnCompleted());
    ok(obsc.hasOnCompleted);
  });

  test('AsObserver_Hides', function () {
    var obs = new MyObserver();

    var res = obs.asObserver();

    notDeepEqual(obs, res);
  });

  test('AsObserver_Forwards', function () {
    var obsn = new MyObserver();
    obsn.asObserver().onNext(42);
    equal(obsn.hasOnNext, 42);

    var error = new Error();
    obse = new MyObserver();
    obse.asObserver().onError(error);
    equal(obse.hasOnError, error);

    var obsc = new MyObserver();
    obsc.asObserver().onCompleted();
    ok(obsc.hasOnCompleted);
  });

  var MyObserver = (function () {
    function onNext (value) {
      this.hasOnNext = value;
    }

    function onError (err) {
      this.hasOnError = err;
    }

    function onCompleted () {
      this.hasOnCompleted = true;
    }

    return function () {
      var obs = new Observer();
      obs.onNext = onNext;
      obs.onError = onError;
      obs.onCompleted = onCompleted;

      return obs;
    };
  }());

}());
