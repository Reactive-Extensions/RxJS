var RxOld = require('../old/rx.all');
var RxNew = require('../../../dist/rx.all');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// add tests
suite.add('old', function() {
  RxOld.Observable.forkJoin(
    RxOld.Observable.range(0, 10),
    RxOld.Observable.range(10, 10),
    RxOld.Observable.range(20, 10),
    RxOld.Observable.range(30, 10)
  )
  .subscribe();
})
.add('new', function() {
  RxNew.Observable.forkJoin(
    RxNew.Observable.range(0, 10),
    RxNew.Observable.range(10, 10),
    RxNew.Observable.range(20, 10),
    RxNew.Observable.range(30, 10)
  )
  .subscribe();
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
