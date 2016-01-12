'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Subject = require('../subject');
var CompositeDisposable = require('../compositedisposable');
var RefCountDisposable = require('../refcountdisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var addRef = require('../internal/addref');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
	require('../scheduler/defaultscheduler');
}

function WindowTimeObserver(state) {
  this._state = state;
  AbstractObserver.call(this);
}

inherits(WindowTimeObserver, AbstractObserver);

WindowTimeObserver.prototype.next = function (x) {
  for (var i = 0, len = this._state.q.length; i < len; i++) { this._state.q[i].onNext(x); }
};

WindowTimeObserver.prototype.error = function (e) {
  for (var i = 0, len = this._state.q.length; i < len; i++) { this._state.q[i].onError(e); }
  this._state.o.onError(e);
};

WindowTimeObserver.prototype.completed = function () {
  for (var i = 0, len = this._state.q.length; i < len; i++) { this._state.q[i].onCompleted(); }
  this._state.o.onCompleted();
};

function WindowTimeObservable(source, timeSpan, timeShift, scheduler) {
	this.source = source;
	this._timeSpan = timeSpan;
	this._timeShift = timeShift;
	this._scheduler = scheduler;
	ObservableBase.call(this);
}

inherits(WindowTimeObservable, ObservableBase);

WindowTimeObservable.prototype.subscribeCore = function (o) {
	var self = this;
	var groupDisposable,
		nextShift = self._timeShift,
		nextSpan = self._timeSpan,
		q = [],
		refCountDisposable,
		timerD = new SerialDisposable(),
		totalTime = 0;
		groupDisposable = new CompositeDisposable(timerD),
		refCountDisposable = new RefCountDisposable(groupDisposable);

	function createTimer () {
		var m = new SingleAssignmentDisposable(),
			isSpan = false,
			isShift = false;
		timerD.setDisposable(m);
		if (nextSpan === nextShift) {
		  isSpan = true;
		  isShift = true;
		} else if (nextSpan < nextShift) {
			isSpan = true;
		} else {
			isShift = true;
		}
		var newTotalTime = isSpan ? nextSpan : nextShift,
			ts = newTotalTime - totalTime;
		totalTime = newTotalTime;
		if (isSpan) {
			nextSpan += self._timeShift;
		}
		if (isShift) {
			nextShift += self._timeShift;
		}
		m.setDisposable(self._scheduler.scheduleFuture(null, ts, function () {
			if (isShift) {
				var s = new Subject();
				q.push(s);
				o.onNext(addRef(s, refCountDisposable));
			}
			isSpan && q.shift().onCompleted();
			createTimer();
		}));
	}
	q.push(new Subject());
	o.onNext(addRef(q[0], refCountDisposable));
	createTimer();
	groupDisposable.add(self.source.subscribe(new WindowTimeObserver({q: q, o: o})));
	return refCountDisposable;
};

module.exports = function (source, timeSpan, timeShiftOrScheduler, scheduler) {
	var timeShift;
	timeShiftOrScheduler == null && (timeShift = timeSpan);
	isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
	if (typeof timeShiftOrScheduler === 'number') {
		timeShift = timeShiftOrScheduler;
	} else if (isScheduler(timeShiftOrScheduler)) {
		timeShift = timeSpan;
		scheduler = timeShiftOrScheduler;
	}
	return new WindowTimeObservable(source, timeSpan, timeShift, scheduler);
};
