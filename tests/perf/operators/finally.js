var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// Backfill range to get rid of differences
RxOld.range = function (start, count) {
  var scheduler = RxNew.Scheduler.currentThread;
  return new RxNew.AnonymousObservable(function (observer) {
    return scheduler.scheduleRecursive(0, function (i, self) {
      if (i < count) {
        observer.onNext(start + i);
        self(i + 1);
      } else {
        observer.onCompleted();
      }
    });
  });
};
RxNew.range = RxOld.range;

function add() { return this.x + this.y; }
var thisArg = {
	x:42,
	y:42
};

// add tests
suite.add('old', function() {
  RxOld.Observable.range(0, 50)
  	.finally(add, thisArg).subscribe();
})
.add('new', function() {
  RxNew.Observable.range(0, 50)
  	.finally(add, thisArg).subscribe();
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
