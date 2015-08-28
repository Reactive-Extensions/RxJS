(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

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

  test('fromNodeCallback Single', function () {
    var res = Observable.fromNodeCallback(function (file, cb) {
      cb(null, file);
    })('foo');

    res.subscribe(
      function (r) {
        equal(r, 'foo');
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('fromNodeCallback Selector', function () {
    var res = Observable.fromNodeCallback(
      function (f,s,t,cb) {
        cb(null, f,s,t);
      },
      null,
      function (f) {
        return f;
      })(1,2,3);

    res.subscribe(
      function (r) {
        equal(r, 1);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('fromNodeCallback Context', function () {
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
      function () {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('fromNodeCallback Error', function () {
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
        function () {
          ok(1);
        }, function () {
          ok(false);
        }, function () {
          ok(true);
        });


    res.subscribe(observer);

    res.subscribe(function () {
      ok(1);
    }, function () {
      ok(false);
    }, function () {
      ok(true);
    });

    equal(1, count);

  });

}());
