var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

function noop() { }
var error = new Error();

// add tests
suite.add('old', function() {
  RxOld.Observable.throwError(error).subscribe(noop,noop,noop);
})
.add('new', function() {
  RxNew.Observable.throwError(error).subscribe(noop,noop,noop);
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
