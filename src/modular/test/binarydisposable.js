'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Disposable = require('../disposable');
var BinaryDisposable = require('../binarydisposable');

test('BinaryDisposable#constructor', function (t) {
  var disp1 = false;
  var disp2 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });

  var b = new BinaryDisposable(d1, d2);

  t.equal(b.isDisposed, false, 'should not be disposed');
  t.equal(disp1, false, 'first should not be disposed');
  t.equal(disp2, false, 'second should not be disposed');

  t.end();
});

test('BinaryDisposable#dispose', function (t) {
  var disp1 = false;
  var disp2 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });

  var b = new BinaryDisposable(d1, d2);

  t.equal(b.isDisposed, false, 'should not be disposed');
  t.equal(disp1, false, 'first should not be disposed');
  t.equal(disp2, false, 'second should not be disposed');

  b.dispose();

  t.equal(b.isDisposed, true, 'should be disposed');
  t.equal(disp1, true, 'first should be disposed');
  t.equal(disp2, true, 'second should be disposed');

  b.dispose();

  t.equal(b.isDisposed, true, 'should be idempotent');
  t.equal(disp1, true, 'first should be idempotent');
  t.equal(disp2, true, 'second should be idempotent');

  t.end();
});
