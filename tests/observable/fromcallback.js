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

test('FromCallback_Single', function () {
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

test('FromNodeCallback_Selector', function () {
  var res = Observable.fromCallback(
    function (f,s,t,cb) {
      cb(f,s,t);
    },
    null,
    function (r) {
      return r[0];
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

test('FromCallback_Context', function () {
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
