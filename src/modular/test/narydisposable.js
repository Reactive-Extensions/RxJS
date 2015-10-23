'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Disposable = require('../disposable');
var NAryDisposable = require('../NAryDisposable');

test('NAryDisposable#constructor', function (t) {
  var disp1 = false;
  var disp2 = false;
  var disp3 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });
  var d3 = Disposable.create(function () { disp3 = true; });

  var b = new NAryDisposable([d1, d2, d3]);

  t.equal(b.isDisposed, false, 'should not be disposed');
  t.equal(disp1, false, 'first should not be disposed');
  t.equal(disp2, false, 'second should not be disposed');
  t.equal(disp3, false, 'third should not be disposed');

  t.end();
});

test('NAryDisposable#dispose', function (t) {
  var disp1 = false;
  var disp2 = false;
  var disp3 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });
  var d3 = Disposable.create(function () { disp3 = true; });

  var b = new NAryDisposable([d1, d2, d3]);

  t.equal(b.isDisposed, false, 'should not be disposed');
  t.equal(disp1, false, 'first should not be disposed');
  t.equal(disp2, false, 'second should not be disposed');
  t.equal(disp1, false, 'third should not be disposed');

  b.dispose();

  t.equal(b.isDisposed, true, 'should be disposed');
  t.equal(disp1, true, 'first should be disposed');
  t.equal(disp2, true, 'second should be disposed');
  t.equal(disp2, true, 'third should be disposed');

  b.dispose();

  t.equal(b.isDisposed, true, 'should be idempotent');
  t.equal(disp1, true, 'first should be idempotent');
  t.equal(disp2, true, 'second should be idempotent');
  t.equal(disp2, true, 'third should be idempotent');

  t.end();
});
