QUnit.module('isEqual');

var isEqual = Rx.internals.isEqual;

test('isEqual_bool_equal', function () {
  ok(isEqual(true, true));
});

test('isEqual_bool_inequal', function () {
  ok(!isEqual(true, false));
});

test('isEqual_number_equal', function () {
  ok(isEqual(42, 42));
});

test('isEqual_number_inequal', function () {
  ok(!isEqual(42, 0));
});

test('isEqual_number +0 not equal to -0', function () {
  ok(!isEqual(+0, -0));
});

test('isEqual_number NaN is equal to NaN', function () {
  ok(isEqual(NaN, NaN));
});

test('isEqual_number Infinity is equal to Infinity', function () {
  ok(isEqual(Infinity, Infinity));
});

test('isEqual_string_equal', function () {
  ok(isEqual('foo', 'foo'));
});

test('isEqual_string_inequal', function () {
  ok(!isEqual('foo', 'bar'));
});

test('isEqual_array_equal', function () {
  ok(isEqual([1,2,3], [1,2,3]));
});

test('isEqual_array_inequal', function () {
  ok(!isEqual([1,2,3], ['foo', 'bar']));
});

test('isEqual object equal', function () {
  ok(isEqual({foo: 'bar'}, {foo: 'bar'}));
});

test('isEqual object inequal', function () {
  ok(!isEqual({foo: 'bar'}, {foo: 'baz'}));
});

test('isEqual complex object equal', function () {
  ok(isEqual({foo: 'bar', baz: [1,2,3]}, {foo: 'bar', baz: [1,2,3]}));
});

test('isEqual complex object inequal', function () {
  ok(!isEqual({foo: 'bar', baz: [1,2,3]}, {foo: 'bar', baz: [4,5,6]}));
});

test('isEqual new object equal', function () {
  function Foo () { }
  ok(isEqual(new Foo(), new Foo()));
});

test('isEqual new object inequal', function () {
  function Foo () { }
  function Bar () { }
  ok(!isEqual(new Foo(), new Bar()));
});
