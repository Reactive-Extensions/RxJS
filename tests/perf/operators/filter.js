var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');

function divByTwo(x) { return x / 2 === 0; }
function divByTen(x) { return x / 10 === 0; }

var oldStart = new Date();
RxOld.Observable.range(0, 2500000)
  .filter(divByTwo)
  .filter(divByTen)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - oldStart;
    console.log('Old time elapsed:', elapsed);
  });

var newStart = new Date();
RxNew.Observable.range(0, 2500000)
  .filter(divByTwo)
  .filter(divByTen)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - newStart;
    console.log('New time elapsed:', elapsed);
  });
