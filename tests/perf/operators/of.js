var RxOld = require('../old/rx.lite');
var RxNew = require('../../../dist/rx.lite');

var args = [];
for (var i = 0; i < 250; i++) { args.push(i); }

var oldStart = new Date();
RxOld.Observable.of.apply(null, args)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - oldStart;
    console.log('Old time elapsed:', elapsed);
  });

var newStart = new Date();
RxNew.Observable.of.apply(null, args)
  .subscribeOnCompleted(function () {
    var elapsed = new Date() - newStart;
    console.log('New time elapsed:', elapsed);
  });
