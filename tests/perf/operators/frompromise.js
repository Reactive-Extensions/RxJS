var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

function MockPromise(value) {
  this.value = value;
}
MockPromise.resolve = function (value) {
  return new MockPromise(value);
}
MockPromise.prototype.then = function (onSuccess) {
  return MockPromise.resolve(onSuccess(this.value));
};

// add tests
suite.add('old', function() {
  RxOld.Observable.fromPromise(MockPromise.resolve(42)).subscribe();
})
.add('new', function() {
  RxNew.Observable.fromPromise(MockPromise.resolve(42)).subscribe();
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });