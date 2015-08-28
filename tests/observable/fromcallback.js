(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

  QUnit.module('fromCallback');

  var Observable = Rx.Observable;

  test('fromCallback', function () {
    var res = Observable.fromCallback(function (cb) {
      cb(true);
    })();

    res.subscribe(
      function (r) {
        equal(r, true);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('fromCallback single argument', function () {
    var res = Observable.fromCallback(function (file, cb) {
      cb(file);
    })('file.txt');

    res.subscribe(
      function (r) {
        equal(r, 'file.txt');
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('fromCallback selector', function () {
    var res = Observable.fromCallback(
      function (f,s,t,cb) {
        cb(f,s,t);
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

  test('fromCallback context', function () {
    var res = Observable.fromCallback(
      function (cb) {
        equal(this, 42);
        cb(true);
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

  test('fromCallback resubscribe', function() {

    var count = 0;

    var res = Observable.fromCallback(
        function(cb) {
          cb(++count);
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
