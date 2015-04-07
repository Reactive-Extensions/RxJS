var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var obj = {foo: 'foo',bar: 'bar',baz:'baz',quux:'quux'};

// add tests
suite.add('old', function() {
  RxOld.Observable.pairs(obj).subscribe();
})
.add('new', function() {
  RxNew.Observable.pairs(obj).subscribe();
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
