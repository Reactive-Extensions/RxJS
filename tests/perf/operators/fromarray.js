var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');

var args1 = [];
for (var i = 0; i < 2500000; i++) { args1.push(i); }

var args2 = [];
for (var i = 0; i < 2500000; i++) { args2.push(i); }

var oldStart = new Date();
RxOld.Observable.fromArray(args1)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - oldStart;
    console.log('Old time elapsed:', elapsed);
  });

var newStart = new Date();
RxNew.Observable.fromArray(args2)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - newStart;
    console.log('New time elapsed:', elapsed);
  });
