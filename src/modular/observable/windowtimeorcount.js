'use strict';

var AnonymousObservable = require('./anonymousobservable');
var Subject = require('../subject');
var CompositeDisposable = require('../compositedisposable');
var RefCountDisposable = require('../refcountdisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var addRef = require('../internal/addref');
var Scheduler = require('../scheduler');

module.exports = function windowTimeOrCount (source, timeSpan, count, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
  return new AnonymousObservable(function (observer) {
    var timerD = new SerialDisposable(),
        groupDisposable = new CompositeDisposable(timerD),
        refCountDisposable = new RefCountDisposable(groupDisposable),
        n = 0,
        windowId = 0,
        s = new Subject();

    function createTimer(id) {
      var m = new SingleAssignmentDisposable();
      timerD.setDisposable(m);
      m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
        if (id !== windowId) { return; }
        n = 0;
        var newId = ++windowId;
        s.onCompleted();
        s = new Subject();
        observer.onNext(addRef(s, refCountDisposable));
        createTimer(newId);
      }));
    }

    observer.onNext(addRef(s, refCountDisposable));
    createTimer(0);

    groupDisposable.add(source.subscribe(
      function (x) {
        var newId = 0, newWindow = false;
        s.onNext(x);
        if (++n === count) {
          newWindow = true;
          n = 0;
          newId = ++windowId;
          s.onCompleted();
          s = new Subject();
          observer.onNext(addRef(s, refCountDisposable));
        }
        newWindow && createTimer(newId);
      },
      function (e) {
        s.onError(e);
        observer.onError(e);
      }, function () {
        s.onCompleted();
        observer.onCompleted();
      }
    ));
    return refCountDisposable;
  }, source);
};
