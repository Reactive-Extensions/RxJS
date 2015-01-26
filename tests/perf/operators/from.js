var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');

var args1 = [];
for (var i = 0; i < 2500000; i++) { args1.push(i); }
var argStr1 = args1.join('');

var args2 = [];
for (var i = 0; i < 2500000; i++) { args2.push(i); }
var argStr2 = args2.join('');

var oldStart = new Date();
RxOld.Observable.from(args1)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - oldStart;
    console.log('Old time elapsed:', elapsed);
  });

var newStart = new Date();
RxNew.Observable.from(args2)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - newStart;
    console.log('New time elapsed:', elapsed);
  });
