(function () {
  QUnit.module('FromNodeCallback');

  var Observable = Rx.Observable;

  test('FromNodeCallback', function () {
    var res = Observable.fromNodeCallback(function (cb) {
      cb(null);
    })();

    res.subscribe(function () {
      ok(true);
    });
  });

  test('FromNodeCallback_Single', function () {
    var res = Observable.fromNodeCallback(function (file, cb) {
      cb(null, file);
    })('foo');

    res.subscribe(
      function (r) {
        equal(r, 'foo');
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromNodeCallback_Selector', function () {
    var res = Observable.fromNodeCallback(
      function (f,s,t,cb) {
        cb(null, f,s,t);
      },
      null,
      function (f,s,t) {
        return f;
      })(1,2,3);

    res.subscribe(
      function (r) {
        equal(r, 1);
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromNodeCallback_Context', function () {
    var res = Observable.fromNodeCallback(
      function (cb) {
        equal(this, 42);
        cb(null);
      },
      42)();

    res.subscribe(
      function () {
        ok(true);
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromNodeCallback_Error', function () {
    var error = new Error();

    var res = Observable.fromNodeCallback(function (cb) {
      cb(error);
    })();

    res.subscribe(
      function () {
        ok(false);
      },
      function (err) {
        equal(err, error);
      },
      function () {
        ok(false);
      });
  });

  test('FromCallback_Resubscribe', function() {

    var count = 0;

    var res = Observable.fromNodeCallback(
        function(cb) {
          cb(null, ++count);
        })();

    var observer = Rx.Observer.create(
        function (v) {
          ok(1);
        }, function (err) {
          ok(false);
        }, function () {
          ok(true);
        });


    res.subscribe(observer);

    res.subscribe(function (v) {
      ok(1);
    }, function (err) {
      ok(false);
    }, function () {
      ok(true);
    });

    equal(1, count);

  });

}());
