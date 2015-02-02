var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var args = [];
for (var i = 0; i < 25; i++) { args.push(i); }
var argStr = args.join('');

// add tests
suite.add('old array', function() {
  RxOld.Observable.from(args).subscribe();
})
.add('new array', function() {
  RxNew.Observable.from(args).subscribe();
})
suite.add('old string', function() {
  RxOld.Observable.from(argStr).subscribe();
})
.add('new string', function() {
  RxNew.Observable.from(argStr).subscribe();
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
