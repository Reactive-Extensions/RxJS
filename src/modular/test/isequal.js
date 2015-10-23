'use strict';

var test = require('tape');
var isEqual = require('../internal/isequal');

test('isEqual bool equal', function (t) {
  t.ok(isEqual(true, true));
  t.end();
});

test('isEqual bool inequal', function (t) {
  t.ok(!isEqual(true, false));
  t.end();
});

test('isEqual number equal', function (t) {
  t.ok(isEqual(42, 42));
  t.end();
});

test('isEqual number inequal', function (t) {
  t.ok(!isEqual(42, 0));
  t.end();
});

test('isEqual number +0 equal to -0', function (t) {
  t.ok(isEqual(+0, -0));
  t.end();
});

test('isEqual number NaN is equal to NaN', function (t) {
  t.ok(isEqual(NaN, NaN));
  t.end();
});

test('isEqual number Infinity is equal to Infinity', function (t) {
  t.ok(isEqual(Infinity, Infinity));
  t.end();
});

test('isEqual string equal', function (t) {
  t.ok(isEqual('foo', 'foo'));
  t.end();
});

test('isEqual string inequal', function (t) {
  t.ok(!isEqual('foo', 'bar'));
  t.end();
});

test('isEqual array equal', function (t) {
  t.ok(isEqual([1,2,3], [1,2,3]));
  t.end();
});

test('isEqual array inequal', function (t) {
  t.ok(!isEqual([1,2,3], ['foo', 'bar']));
  t.end();
});

test('isEqual object equal', function (t) {
  t.ok(isEqual({foo: 'bar'}, {foo: 'bar'}));
  t.end();
});

test('isEqual object inequal', function (t) {
  t.ok(!isEqual({foo: 'bar'}, {foo: 'baz'}));
  t.end();
});

test('isEqual complex object equal', function (t) {
  t.ok(isEqual({foo: 'bar', baz: [1,2,3]}, {foo: 'bar', baz: [1,2,3]}));
  t.end();
});

test('isEqual complex object inequal', function (t) {
  t.ok(!isEqual({foo: 'bar', baz: [1,2,3]}, {foo: 'bar', baz: [4,5,6]}));
  t.end();
});

test('isEqual new object equal', function (t) {
  function Foo () { }
  t.ok(isEqual(new Foo(), new Foo()));
  t.end();
});

test('isEqual new object inequal', function (t) {
  function Foo () { }
  function Bar () { }
  t.ok(!isEqual(new Foo(), new Bar()));
  t.end();
});
