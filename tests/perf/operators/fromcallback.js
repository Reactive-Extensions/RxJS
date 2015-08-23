var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var fs = require('fs');

// add tests
suite.add('old', function() {
  RxOld.Observable.fromCallback(fs.exists)(__filename).subscribe();
})
.add('new', function() {
  RxNew.Observable.fromCallback(fs.exists)(__filename).subscribe();
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
