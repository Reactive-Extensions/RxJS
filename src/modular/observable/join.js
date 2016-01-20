'use strict';

var AnonymousObservable = require('./anonymousobservable'); // TODO: Get rid of
var take = require('./take');
var CompositeDisposable = require('../compositedisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var noop = require('../helpers/noop');
var tryCatch = require('../internal/trycatchutils').tryCatch;

require('es6-map/implement');

module.exports = function join (left, right, leftDurationSelector, rightDurationSelector, resultSelector) {
  return new AnonymousObservable(function (o) {
    var group = new CompositeDisposable();
    var leftDone = false, rightDone = false;
    var leftId = 0, rightId = 0;
    var leftMap = new global.Map(), rightMap = new global.Map();
    var handleError = function (e) { o.onError(e); };

    group.add(left.subscribe(
      function (value) {
        var id = leftId++, md = new SingleAssignmentDisposable();

        leftMap.set(id, value);
        group.add(md);

        var duration = tryCatch(leftDurationSelector)(value);
        if (duration === global._Rx.errorObj) { return o.onError(duration.e); }

        md.setDisposable(take(duration, 1).subscribe(
          noop,
          handleError,
          function () {
            leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
            group.remove(md);
          }));

        rightMap.forEach(function (v) {
          var result = tryCatch(resultSelector)(value, v);
          if (result === global._Rx.errorObj) { return o.onError(result.e); }
          o.onNext(result);
        });
      },
      handleError,
      function () {
        leftDone = true;
        (rightDone || leftMap.size === 0) && o.onCompleted();
      })
    );

    group.add(right.subscribe(
      function (value) {
        var id = rightId++, md = new SingleAssignmentDisposable();

        rightMap.set(id, value);
        group.add(md);

        var duration = tryCatch(rightDurationSelector)(value);
        if (duration === global._Rx.errorObj) { return o.onError(duration.e); }

        md.setDisposable(take(duration, 1).subscribe(
          noop,
          handleError,
          function () {
            rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
            group.remove(md);
          }));

        leftMap.forEach(function (v) {
          var result = tryCatch(resultSelector)(v, value);
          if (result === global._Rx.errorObj) { return o.onError(result.e); }
          o.onNext(result);
        });
      },
      handleError,
      function () {
        rightDone = true;
        (leftDone || rightMap.size === 0) && o.onCompleted();
      })
    );
    return group;
  }, left);
};
