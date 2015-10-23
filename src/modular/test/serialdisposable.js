'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var SerialDisposable = require('../serialdisposable');
var Disposable = require('../disposable');


test('SerialDisposable#constructor', function (t) {
  var m = new SerialDisposable();

  t.ok(!m.getDisposable(), 'should not have a disposable');

  t.end();
});

test('SerialDisposable replace before dispose()', function (t) {
  var disp1 = false;
  var disp2 = false;

  var m = new SerialDisposable();

  var d1 = Disposable.create(function () { disp1 = true; });
  m.setDisposable(d1);

  t.equal(d1, m.getDisposable(), 'should have a disposable set');
  t.ok(!disp1, 'should not be disposed');

  var d2 = Disposable.create(function () { disp2 = true; });
  m.setDisposable(d2);

  t.equal(d2, m.getDisposable(), 'should have a new disposable set');
  t.ok(disp1, 'first should be disposed');
  t.ok(!disp2, 'next should not be disposed');

  t.end();
});

test('SerialDisposable replace after dispose', function (t) {
  var disp1 = false;
  var disp2 = false;

  var m = new SerialDisposable();
  m.dispose();

  var d1 = Disposable.create(function () { disp1 = true; });
  m.setDisposable(d1);

  t.equal(null, m.getDisposable(), 'should not have a set disposable after dispose');
  t.ok(disp1, 'should be disposed');

  var d2 = Disposable.create(function () { disp2 = true; });
  m.setDisposable(d2);

  t.equal(null, m.getDisposable(), 'should not have a set disposable after dispose');
  t.ok(disp2, 'should be disposed');

  t.end();
});

test('SerialDisposable#dispose', function (t) {
  var disp = false;

  var m = new SerialDisposable();
  var d = Disposable.create(function () { disp = true; });
  m.setDisposable(d);

  t.equal(d, m.getDisposable(), 'should have set the disposable');
  t.ok(!disp, 'should not be disposed before dispose()');

  m.dispose();

  t.ok(disp, 'should be disposed after dispose()');
  t.equal(null, m.getDisposable(), 'should clear the current disposable');

  t.end();
});
