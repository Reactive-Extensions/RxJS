(function () {
  QUnit.module('FromCallback');

  var Observable = Rx.Observable;

  test('FromCallback', function () {
    var res = Observable.fromCallback(function (cb) {
      cb(true);
    })();

    res.subscribe(
      function (r) {
        equal(r, true);
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromCallback Single', function () {
    var res = Observable.fromCallback(function (file, cb) {
      cb(file);
    })('file.txt');

    res.subscribe(
      function (r) {
        equal(r, 'file.txt');
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromCallback Selector', function () {
    var res = Observable.fromCallback(
      function (f,s,t,cb) {
        cb(f,s,t);
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

  test('FromCallback Context', function () {
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
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
      });
  });

  test('FromCallback_Resubscribe', function() {

    var count = 0;

    var res = Observable.fromCallback(
        function(cb) {
          cb(++count);
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
