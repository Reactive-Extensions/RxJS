var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');

function square(x) { return x * x; }
function double(x) { return x + x; }

var oldStart = new Date();
RxOld.Observable.range(0, 2500000)
  .map(square)
  .map(double)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - oldStart;
    console.log('Old time elapsed:', elapsed);
  });

var newStart = new Date();
RxNew.Observable.range(0, 2500000)
  .map(square)
  .map(double)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - newStart;
    console.log('New time elapsed:', elapsed);
  });
