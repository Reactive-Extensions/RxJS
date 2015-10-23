'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Disposable = require('../disposable');
var CompositeDisposable = require('../compositedisposable');

function noop() { }

test('CompositeDisposable#add', function (t) {
  var d1 = Disposable.create(noop),
      d2 = Disposable.create(noop),
      g = new CompositeDisposable(d1);

  t.equal(1, g.length, 'should have a length of one');

  g.add(d2);
  t.equal(2, g.length, 'should have a length of two after add');

  t.end();
});

test('CompositeDisposable#add after dispose', function (t) {
  var disp1 = false;
  var disp2 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });

  var g = new CompositeDisposable(d1);
  t.equal(1, g.length, 'should have a length of 1');

  g.dispose();
  t.ok(disp1, 'should be disposed');
  t.equal(0, g.length, 'should have a length of 0');

  g.add(d2);
  t.ok(disp2, 'should be disposed');
  t.equal(0, g.length, 'should have a length of 0');

  t.end();
});

test('CompositeDisposable#remove', function (t) {
  var disp1 = false;
  var disp2 = false;

  var d1 = Disposable.create(function () { disp1 = true; });
  var d2 = Disposable.create(function () { disp2 = true; });

  var g = new CompositeDisposable(d1, d2);

  t.equal(2, g.length, 'should have a length of two');

  t.ok(g.remove(d1), 'remove() should return true for first disposable');

  t.equal(1, g.length, 'should have a length of one');

  t.ok(disp1, 'first should be disposed');
  t.ok(g.remove(d2), 'remove() should return true for second disposable');
  t.ok(disp2, 'second should be disposed');

  var disp3 = false;
  var d3 = Disposable.create(function () { disp3 = true; });

  t.ok(!g.remove(d3), 'remove() should return false for third disposable');
  t.ok(!disp3, 'third should not have been disposed');

  t.end();
});
