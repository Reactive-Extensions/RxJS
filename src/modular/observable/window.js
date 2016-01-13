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
var noop = require('../helpers/noop');

function returnWindow(x, win) { return win; }

function observableWindowWithOpenings(source, windowOpenings, windowClosingSelector) {
  return groupJoin(source, windowOpenings, windowClosingSelector, empty, returnWindow);
}

function observableWindowWithBoundaries(source, windowBoundaries) {
  return new AnonymousObservable(function (observer) {
    var win = new Subject(),
      d = new CompositeDisposable(),
      r = new RefCountDisposable(d);

    observer.onNext(addRef(win, r));

    d.add(source.subscribe(function (x) {
      win.onNext(x);
    }, function (err) {
      win.onError(err);
      observer.onError(err);
    }, function () {
      win.onCompleted();
      observer.onCompleted();
    }));

    isPromise(windowBoundaries) && (windowBoundaries = fromPromise(windowBoundaries));

    d.add(windowBoundaries.subscribe(function () {
      win.onCompleted();
      win = new Subject();
      observer.onNext(addRef(win, r));
    }, function (err) {
      win.onError(err);
      observer.onError(err);
    }, function () {
      win.onCompleted();
      observer.onCompleted();
    }));

    return r;
  }, source);
}

function observableWindowWithClosingSelector(source, windowClosingSelector) {
  return new AnonymousObservable(function (observer) {
    var m = new SerialDisposable(),
      d = new CompositeDisposable(m),
      r = new RefCountDisposable(d),
      win = new Subject();
    observer.onNext(addRef(win, r));
    d.add(source.subscribe(function (x) {
      win.onNext(x);
    }, function (err) {
      win.onError(err);
      observer.onError(err);
    }, function () {
      win.onCompleted();
      observer.onCompleted();
    }));

    function createWindowClose () {
      var windowClose;
      try {
        windowClose = windowClosingSelector();
      } catch (e) {
        observer.onError(e);
        return;
      }

      isPromise(windowClose) && (windowClose = fromPromise(windowClose));

      var m1 = new SingleAssignmentDisposable();
      m.setDisposable(m1);
      m1.setDisposable(take(windowClose, 1).subscribe(noop, function (err) {
        win.onError(err);
        observer.onError(err);
      }, function () {
        win.onCompleted();
        win = new Subject();
        observer.onNext(addRef(win, r));
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
  if (arguments.length === 2 && typeof arguments[1] !== 'function') {
    return observableWindowWithBoundaries(source, windowOpeningsOrClosingSelector);
  }
  return typeof windowOpeningsOrClosingSelector === 'function' ?
    observableWindowWithClosingSelector(source, windowOpeningsOrClosingSelector) :
    observableWindowWithOpenings(source, windowOpeningsOrClosingSelector, windowClosingSelector);
};
