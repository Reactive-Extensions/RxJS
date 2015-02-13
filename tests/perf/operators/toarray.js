var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// add tests
suite.add('old', function() {
  RxOld.Observable.range(0, 25).toArray().subscribe();
})
.add('new', function() {
  RxNew.Observable.range(0, 25).toArray().subscribe();
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
