'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Disposable = require('../disposable');

test('Disposable#create', function (t) {
  var disposable = Disposable.create(function () { });
  t.ok(disposable, 'disposable should not be undefined');
  t.end();
});

test('Disposable#dispose', function (t) {
  var disposed = false;
  var d = Disposable.create(function () { disposed = true; });

  t.ok(!disposed, 'should not be disposed');
  d.dispose();
  t.ok(disposed, 'should be disposed');
  t.end();
});

test('Disposable#empty', function (t) {
  var d = Disposable.empty;
  t.ok(d, 'should not be null');
  d.dispose();
  t.end();
});
