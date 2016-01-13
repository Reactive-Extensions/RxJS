'use strict';

var AnonymousObservable = require('./anonymousobservable'); // TODO: Get rid of
var CompositeDisposable = require('../compositedisposable');
var RefCountDisposable = require('../refcountdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var Subject = require('../subject');
var addRef = require('../internal/addref');
var noop = require('../helpers/noop');
var tryCatch = require('../internal/trycatchutils').tryCatch;

require('es6-map/implement');

module.exports = function groupJoin(left, right, leftDurationSelector, rightDurationSelector, resultSelector) {
  return new AnonymousObservable(function (o) {
    var group = new CompositeDisposable();
    var r = new RefCountDisposable(group);
    var leftMap = new global.Map(), rightMap = new global.Map();
    var leftId = 0, rightId = 0;
    var handleError = function (e) { return function (v) { v.onError(e); }; };

    group.add(left.subscribe(
      function (value) {
        var s = new Subject();
        var id = leftId++;
        leftMap.set(id, s);

        var result = tryCatch(resultSelector)(value, addRef(s, r));
        if (result === global.Rx.errorObj) {
          leftMap.forEach(handleError(result.e));
          return o.onError(result.e);
        }
        o.onNext(result);

        rightMap.forEach(function (v) { s.onNext(v); });

        var md = new SingleAssignmentDisposable();
        group.add(md);

        var duration = tryCatch(leftDurationSelector)(value);
        if (duration === global.Rx.errorObj) {
          leftMap.forEach(handleError(duration.e));
          return o.onError(duration.e);
        }

        md.setDisposable(duration.take(1).subscribe(
          noop,
          function (e) {
            leftMap.forEach(handleError(e));
            o.onError(e);
          },
          function () {
            leftMap['delete'](id) && s.onCompleted();
            group.remove(md);
          }));
      },
      function (e) {
        leftMap.forEach(handleError(e));
        o.onError(e);
      },
      function () { o.onCompleted(); })
    );

    group.add(right.subscribe(
      function (value) {
        var id = rightId++;
        rightMap.set(id, value);

        var md = new SingleAssignmentDisposable();
        group.add(md);

        var duration = tryCatch(rightDurationSelector)(value);
        if (duration === global.Rx.errorObj) {
          leftMap.forEach(handleError(duration.e));
          return o.onError(duration.e);
        }

        md.setDisposable(duration.take(1).subscribe(
          noop,
          function (e) {
            leftMap.forEach(handleError(e));
            o.onError(e);
          },
          function () {
            rightMap['delete'](id);
            group.remove(md);
          }));

        leftMap.forEach(function (v) { v.onNext(value); });
      },
      function (e) {
        leftMap.forEach(handleError(e));
        o.onError(e);
      })
    );

    return r;
  }, left);
};
