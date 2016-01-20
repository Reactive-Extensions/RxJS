'use strict';

var CompositeDisposable = require('../compositedisposable');
var RefCountDisposable = require('../refcountdisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var AnonymousObservable = require('./anonymousobservable');
var Subject = require('../subject');
var empty = require('./empty');
var fromPromise = require('./frompromise');
var groupJoin = require('./groupjoin');
var take = require('./take');
var addRef = require('../internal/addref');
var isPromise = require('../helpers/ispromise');
var isFunction = require('../helpers/isfunction');
var noop = require('../helpers/noop');
var tryCatch = require('../internal/trycatchutils').tryCatch;

function returnWindow(x, win) { return win; }

function observableWindowWithOpenings(source, windowOpenings, windowClosingSelector) {
  return groupJoin(windowOpenings, source, windowClosingSelector, empty, returnWindow);
}

function observableWindowWithBoundaries(source, windowBoundaries) {
  return new AnonymousObservable(function (o) {
    var win = new Subject(),
      d = new CompositeDisposable(),
      r = new RefCountDisposable(d);

    o.onNext(addRef(win, r));

    d.add(source.subscribe(function (x) {
      win.onNext(x);
    }, function (err) {
      win.onError(err);
      o.onError(err);
    }, function () {
      win.onCompleted();
      o.onCompleted();
    }));

    isPromise(windowBoundaries) && (windowBoundaries = fromPromise(windowBoundaries));

    d.add(windowBoundaries.subscribe(function () {
      win.onCompleted();
      win = new Subject();
      o.onNext(addRef(win, r));
    }, function (err) {
      win.onError(err);
      o.onError(err);
    }, function () {
      win.onCompleted();
      o.onCompleted();
    }));

    return r;
  }, source);
}

function observableWindowWithClosingSelector(source, windowClosingSelector) {
  return new AnonymousObservable(function (o) {
    var m = new SerialDisposable(),
      d = new CompositeDisposable(m),
      r = new RefCountDisposable(d),
      win = new Subject();
    o.onNext(addRef(win, r));
    d.add(source.subscribe(function (x) {
        win.onNext(x);
    }, function (err) {
        win.onError(err);
        o.onError(err);
    }, function () {
        win.onCompleted();
        o.onCompleted();
    }));

    function createWindowClose () {
      var windowClose = tryCatch(windowClosingSelector)();
      if (windowClose === global._Rx.errorObj) {
        return o.onError(windowClose.e);
      }
      isPromise(windowClose) && (windowClose = fromPromise(windowClose));

      var m1 = new SingleAssignmentDisposable();
      m.setDisposable(m1);
      m1.setDisposable(take(windowClose, 1).subscribe(noop, function (err) {
        win.onError(err);
        o.onError(err);
      }, function () {
        win.onCompleted();
        win = new Subject();
        o.onNext(addRef(win, r));
        createWindowClose();
      }));
    }

    createWindowClose();
    return r;
  }, source);
}

/**
 *  Projects each element of an observable sequence into zero or more windows.
 *
 *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
 *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
 *  @returns {Observable} An observable sequence of windows.
 */
module.exports = function window (source, windowOpeningsOrClosingSelector, windowClosingSelector) {
  if (!windowClosingSelector && !isFunction(windowOpeningsOrClosingSelector)) {
    return observableWindowWithBoundaries(source, windowOpeningsOrClosingSelector);
  }
  return isFunction(windowOpeningsOrClosingSelector) ?
    observableWindowWithClosingSelector(source, windowOpeningsOrClosingSelector) :
    observableWindowWithOpenings(source, windowOpeningsOrClosingSelector, windowClosingSelector);
};
