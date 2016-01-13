'use strict';

var test = require('tape');
var RefCountDisposable = require('../refcountdisposable');

function BooleanDisposable() {
  this.isDisposed = false;
}

BooleanDisposable.prototype.dispose = function () {
  !this.isDisposed && (this.isDisposed = true);
};

test('RefCountDisposable single reference', function (t) {
  var d = new BooleanDisposable();
  var r = new RefCountDisposable(d);
  t.notOk(d.isDisposed, 'should not be disposed');
  r.dispose();
  t.ok(d.isDisposed, 'should be disposed');
  r.dispose();
  t.ok(d.isDisposed, 'should still be disposed');

  t.end();
});

test('RefCountDisposable ref counting', function (t) {
  var d = new BooleanDisposable();
  var r = new RefCountDisposable(d);
  t.notOk(d.isDisposed, 'should not be disposed');

  var d1 = r.getDisposable();
  var d2 = r.getDisposable();
  t.notOk(d.isDisposed, 'after two getDisposable() calls should not be disposed');

  d1.dispose();
  t.notOk(d.isDisposed, 'after one dispose() should not be disposed');

  d2.dispose();
  t.notOk(d.isDisposed, 'after two dispose() should be disposed');

  r.dispose();
  t.ok(d.isDisposed, 'the outer should be disposed');
  t.ok(r.isDisposed, 'the ref counted should be disposed');

  var d3 = r.getDisposable(); // CHECK
  d3.dispose();

  t.end();
});

test('RefCountDisposable primary disposes first', function (t) {
  var d = new BooleanDisposable();
  var r = new RefCountDisposable(d);
  t.notOk(d.isDisposed, 'should not be disposed after creation');

  var d1 = r.getDisposable();
  var d2 = r.getDisposable();
  t.notOk(d.isDisposed, 'should not be disposed after two getDisposable() calls');

  d1.dispose();
  t.notOk(d.isDisposed, 'should not be disposed after one dispose() call');

  r.dispose();
  t.notOk(d.isDisposed, 'should not dispose outer if inner has refs');

  d2.dispose();
  t.ok(d.isDisposed, 'should dispose outer if dispose() called twice');

  t.end();
});
