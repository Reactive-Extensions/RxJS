'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var Disposable = require('../disposable');

test('SingleAssignmentDisposable setDisposable null', function (t) {
  var d = new SingleAssignmentDisposable();

  d.setDisposable(null);

  t.equal(null, d.getDisposable(), 'getDisposable should return null');

  t.end();
});

test('SingleAssignmentDisposable dispose after set', function (t) {
  var disposed = false,
      d = new SingleAssignmentDisposable(),
      dd = Disposable.create(function () { disposed = true; });

  d.setDisposable(dd);
  t.equal(dd, d.getDisposable(), 'should have set the disposable via setDisposable');
  t.ok(!disposed, 'should not be disposed');

  d.dispose();
  t.ok(disposed, 'should be disposed after dispose()');

  d.dispose();
  t.ok(disposed, 'should be idempotent after dispose()');

  t.end();
});

test('SingleAssignmentDisposable dispose before setDisposable', function (t) {
  var disposed = false,
      d = new SingleAssignmentDisposable(),
      dd = Disposable.create(function () { disposed = true; });
  t.ok(!disposed, 'should not be disposed');

  d.dispose();
  t.ok(!disposed, 'should not be disposed after disposed');

  d.setDisposable(dd);
  t.ok(d.getDisposable() == null, 'should not set disposable');
  t.ok(disposed, 'should be disposed after setDisposable');

  d.dispose();
  t.ok(disposed, 'calling dispose should dispose idempotent');

  t.end();
});
