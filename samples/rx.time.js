(function (global, _undefined) {
	var root;
	if (typeof global.module !== 'undefined' && typeof global.module.exports !== 'undefined') {
  	    root = global.require('./rx.js');
  	} else {
  		root = global.Rx;
  	}	
	
	var Observable = root.Observable,
		observableProto = Observable.prototype,
		observableCreateWithDisposable = Observable.createWithDisposable,
		observableDefer = Observable.defer,
		observableToArray = Observable.fromArray,
		observableThrow = Observable.throwException,
		timeoutScheduler = root.Scheduler.Timeout,
		SingleAssignmentDisposable = root.SingleAssignmentDisposable,
		SerialDisposable = root.SerialDisposable,
		CompositeDisposable = root.CompositeDisposable,
		RefCountDisposable = root.RefCountDisposable,
		Subject = root.Subject,
		BinaryObserver = root.BinaryObserver;
	
var normalizeTime = function (timeSpan) {
	return timeSpan < 0 ? 0 : timeSpan;
},
observableTimerDate = function (dueTime, scheduler) {
    return observableCreateWithDisposable(function (observer) {
        return scheduler.scheduleWithAbsolute(dueTime, function () {
            observer.onNext(0);
            observer.onCompleted();
        });
    });
},
observableTimerDateAndPeriod = function (dueTime, period, scheduler) {
    var p = normalizeTime(period);
    return observableCreateWithDisposable(function (observer) {
        var count = 0, d = dueTime;
        return scheduler.scheduleRecursiveWithAbsolute(d, function (self) {
            var now;
            if (p > 0) {
                now = scheduler.now();
                d = d + p;
                if (d <= now) {
                    d = now + p;
                }
            }
            observer.onNext(count++);
            self(d);
        });
    });
},
observableTimerTimeSpan = function (dueTime, scheduler) {
    var d = normalizeTime(dueTime);
    return observableCreateWithDisposable(function (observer) {
        return scheduler.scheduleWithRelative(d, function () {
            observer.onNext(0);
            observer.onCompleted();
        });
    });
},
observableTimerTimeSpanAndPeriod = function (dueTime, period, scheduler) {
    return observableDefer(function () {
        return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
    });
};
var observableinterval = Observable.interval = function (period, scheduler) {
	scheduler || (scheduler = timeoutScheduler);
    return observableTimerTimeSpanAndPeriod(period, period, scheduler);
};
Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
    var period;
    scheduler || (scheduler = timeoutScheduler);
    if (periodOrScheduler !== _undefined && typeof periodOrScheduler === 'number') {
        period = periodOrScheduler;
    } else if (periodOrScheduler !== _undefined && typeof periodOrScheduler === 'object') {
        scheduler = periodOrScheduler;
    }
    if (dueTime instanceof Date && period === _undefined) {
        return observableTimerDate(dueTime.getTime(), scheduler);
    }
    if (dueTime instanceof Date && period !== _undefined) {
        period = periodOrScheduler;
        return observableTimerDateAndPeriod(dueTime.getTime(), period, scheduler);
    }
    if (period === _undefined) {
        return observableTimerTimeSpan(dueTime, scheduler);
    }
    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
};
var observableDelayTimeSpan = function (source, dueTime, scheduler) {
    return observableCreateWithDisposable(function (observer) {
        var active = false, 
			cancelable = new SerialDisposable(), 
			exception = null, 
			q = [], 
			running = false, 
			subscription;
        subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
            var d, shouldRun;
            if (notification.value.kind === 'E') {
                q = [];
                q.push(notification);
                exception = notification.value.exception;
                shouldRun = !running;
            } else {
                q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
                shouldRun = !active;
                active = true;
            }
            if (shouldRun) {
                if (exception !== null) {
                    observer.onError(exception);
                } else {
                    d = new SingleAssignmentDisposable();
                    cancelable.disposable(d);
                    d.disposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
                        var e, recurseDueTime, result, shouldRecurse;
                        if (exception !== null) {
                            return;
                        }
                        running = true;
                        do {
                            result = null;
                            if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                                result = q.shift().value;
                            }
                            if (result !== null) {
                                result.accept(observer);
                            }
                        } while (result !== null);
                        shouldRecurse = false;
                        recurseDueTime = 0;
                        if (q.length > 0) {
                            shouldRecurse = true;
                            recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
                        } else {
                            active = false;
                        }
                        e = exception;
                        running = false;
                        if (e !== null) {
                            observer.onError(e);
                        } else if (shouldRecurse) {
                            self(recurseDueTime);
                        }
                    }));
                }
            }
        });
        return new CompositeDisposable(subscription, cancelable);
    });
};
var observableDelayDate = function (source, dueTime, scheduler) {
    return observableDefer(function () {
        var timeSpan = dueTime - scheduler.now();
        return observableDelayTimeSpan(timeSpan, scheduler);
    });
};
observableProto.delay = function (dueTime, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
	return dueTime instanceof Date ? 
		observableDelayDate(this, dueTime.getTime(), scheduler) :
		observableDelayTimeSpan(this, dueTime, scheduler);
};
observableProto.throttle = function (dueTime, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        var cancelable = new SerialDisposable(), hasvalue = false, id = 0, subscription, value = null;
        subscription = source.subscribe(function (x) {
            var currentId, d;
            hasvalue = true;
            value = x;
            id++;
            currentId = id;
            d = new SingleAssignmentDisposable();
            cancelable.disposable(d);
            d.disposable(scheduler.scheduleWithRelative(dueTime, function () {
                if (hasvalue && id === currentId) {
                    observer.onNext(value);
                }
                hasvalue = false;
            }));
        }, function (exception) {
            cancelable.dispose();
            observer.onError(exception);
            hasvalue = false;
            id++;
        }, function () {
            cancelable.dispose();
            if (hasvalue) {
                observer.onNext(value);
            }
            observer.onCompleted();
            hasvalue = false;
            id++;
        });
        return new CompositeDisposable(subscription, cancelable);
    });
};
observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
    var source = this, timeShift;
    if (timeShiftOrScheduler === _undefined) {
        timeShift = timeSpan;
    }
    if (scheduler === _undefined) {
        scheduler = timeoutScheduler;
    }
    if (typeof timeShiftOrScheduler === 'number') {
        timeShift = timeShiftOrScheduler;
    } else if (typeof timeShiftOrScheduler === 'object') {
        timeShift = timeSpan;
        scheduler = timeShiftOrScheduler;
    }
    return observableCreateWithDisposable(function (observer) {
        var createTimer, 
			groupDisposable, 
			nextShift = timeShift, 
			nextSpan = timeSpan, 
			q = [],
			refCountDisposable, 
			timerD = new SerialDisposable(), 
			totalTime = 0;
        groupDisposable = new CompositeDisposable(timerD);
        refCountDisposable = new RefCountDisposable(groupDisposable);
        createTimer = function () {
            var isShift, isSpan, m, newTotalTime, ts;
            m = new SingleAssignmentDisposable();
            timerD.disposable(m);
            isSpan = false;
            isShift = false;
            if (nextSpan === nextShift) {
                isSpan = true;
                isShift = true;
            } else if (nextSpan < nextShift) {
                isSpan = true;
            } else {
                isShift = true;
            }
            newTotalTime = isSpan ? nextSpan : nextShift;
            ts = newTotalTime - totalTime;
            totalTime = newTotalTime;
            if (isSpan) {
                nextSpan += timeShift;
            }
            if (isShift) {
                nextShift += timeShift;
            }
            m.disposable(scheduler.scheduleWithRelative(ts, function () {
                var s;
                if (isShift) {
                    s = new Subject();
                    q.push(s);
                    observer.onNext(s.addRef(refCountDisposable));
                }
                if (isSpan) {
                    s = q.shift();
                    s.onCompleted();
                }
                createTimer();
            }));
        };
        q.push(new Subject());
        observer.onNext(q[0].addRef(refCountDisposable));
        createTimer();
        groupDisposable.add(source.subscribe(function (x) {
            var i, s;
            for (i = 0; i < q.length; i++) {
                s = q[i];
                s.onNext(x);
            }
        }, function (e) {
            var i, s;
            for (i = 0; i < q.length; i++) {
                s = q[i];
                s.onError(e);
            }
            observer.onError(e);
        }, function () {
            var i, s;
            for (i = 0; i < q.length; i++) {
                s = q[i];
                s.onCompleted();
            }
            observer.onCompleted();
        }));
        return refCountDisposable;
    });
};
observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
    var source = this;
    scheduler || (scheduler = timeoutScheduler);
    return observableCreateWithDisposable(function (observer) {
        var createTimer, 
			groupDisposable, 
			n = 0, 
			refCountDisposable, 
			s, 
			timerD = new SerialDisposable(), 
			windowId = 0;
        groupDisposable = new CompositeDisposable(timerD);
        refCountDisposable = new RefCountDisposable(groupDisposable);
        createTimer = function (id) {
            var m = new SingleAssignmentDisposable();
            timerD.disposable(m);
            m.disposable(scheduler.scheduleWithRelative(timeSpan, function () {
                var newId;
                if (id !== windowId) {
                    return;
                }
                n = 0;
                newId = ++windowId;
                s.onCompleted();
                s = new Subject();
                observer.onNext(s.addRef(refCountDisposable));
                createTimer(newId);
            }));
        };
        s = new Subject();
        observer.onNext(s.addRef(refCountDisposable));
        createTimer(0);
        groupDisposable.add(source.subscribe(function (x) {
            var newId = 0, newWindow = false;
            s.onNext(x);
            n++;
            if (n === count) {
                newWindow = true;
                n = 0;
                newId = ++windowId;
                s.onCompleted();
                s = new Subject();
                observer.onNext(s.addRef(refCountDisposable));
            }
            if (newWindow) {
                createTimer(newId);
            }
        }, function (e) {
            s.onError(e);
            observer.onError(e);
        }, function () {
            s.onCompleted();
            observer.onCompleted();
        }));
        return refCountDisposable;
    });
};
observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
    var timeShift;
    if (timeShiftOrScheduler === _undefined) {
        timeShift = timeSpan;
    }
    scheduler || (scheduler = timeoutScheduler);
    if (typeof timeShiftOrScheduler === 'number') {
        timeShift = timeShiftOrScheduler;
    } else if (typeof timeShiftOrScheduler === 'object') {
        timeShift = timeSpan;
        scheduler = timeShiftOrScheduler;
    }
    return this.windowWithTime(timeSpan, timeShift, scheduler).selectMany(function (x) {
        return x.toArray();
    });
};
observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    return this.windowWithTimeOrCount(timeSpan, count, scheduler).selectMany(function (x) {
        return x.toArray();
    });
};
observableProto.timeInterval = function (scheduler) {
    var source = this;
    scheduler || (scheduler = timeoutScheduler);
    return observableDefer(function () {
        var last = scheduler.now();
        return source.select(function (x) {
            var now = scheduler.now(), span = now - last;
            last = now;
            return {
                value: x,
                interval: span
            };
        });
    });
};
observableProto.timestamp = function (scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    return this.select(function (x) {
        return {
            value: x,
            timestamp: scheduler.now()
        };
    });
};
var sampleObservable = function (source, sampler) {
    return source._combine(sampler, function (observer) {
        var atEnd = false, value;
        return new BinaryObserver(function (newvalue) {
            if (newvalue.kind === 'N') {
                value = newvalue;
            }
            if (newvalue.kind === 'E') {
                newvalue.accept(observer);
            }
            if (newvalue.kind === 'C') {
                atEnd = true;
            }
        }, function () {
            var myvalue = value;
            value = _undefined;
            if (myvalue !== _undefined) {
                myvalue.accept(observer);
            }
            if (atEnd) {
                observer.onCompleted();
            }
        });
    });
};
observableProto.sample = function (intervalOrSampler, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    if (typeof intervalOrSampler === 'number') {
        return sampleObservable(this, observableinterval(intervalOrSampler, scheduler));
    }
    return sampleObservable(this, intervalOrSampler);
};
observableProto.timeout = function (dueTime, other, scheduler) {
    var schedulerMethod, source = this;
    if (other === _undefined) {
        other = observableThrow(new Error('Timeout'));
    }
    scheduler || (scheduler = timeoutScheduler);
    if (dueTime instanceof Date) {
        schedulerMethod = function(dt, action) {
            scheduler.scheduleWithAbsolute(dt, action);
        };
    } else {
          schedulerMethod = function(dt, action) {
            scheduler.scheduleWithRelative(dt, action);
        };      
    }
    return observableCreateWithDisposable(function (observer) {
        var createTimer,
            id = 0,
            original = new SingleAssignmentDisposable(),
            subscription = new SerialDisposable(),
            switched = false,
            timer = new SerialDisposable();
        subscription.disposable(original);
        createTimer = function () {
            var myId = id;
            timer.disposable(schedulerMethod(dueTime, function () {
                var timerWins;
                switched = id === myId;
                timerWins = switched;
                if (timerWins) {
                    subscription.disposable(other.subscribe(observer));
                }
            }));
        };
        createTimer();
        original.disposable(source.subscribe(function (x) {
            var onNextWins = !switched;
            if (onNextWins) {
                id++;
                observer.onNext(x);
                createTimer();
            }
        }, function (e) {
            var onErrorWins = !switched;
            if (onErrorWins) {
                id++;
                observer.onError(e);
            }
        }, function () {
            var onCompletedWins = !switched;
            if (onCompletedWins) {
                id++;
                observer.onCompleted();
            }
        }));
        return new CompositeDisposable(subscription, timer);
    });
};
Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    return observableCreateWithDisposable(function (observer) {
        var first = true,
            hasResult = false,
            result,
            state = initialState, 
            time;
        return scheduler.scheduleRecursiveWithAbsolute(scheduler.now(), function (self) {
            if (hasResult) {
                observer.onNext(result);
            }
            try {
                if (first) {
                    first = false;
                } else {
                    state = iterate(state);
                }
                hasResult = condition(state);
                if (hasResult) {
                    result = resultSelector(state);
                    time = timeSelector(state);
                }
            } catch (e) {
                observer.onError(e);
                return;
            }
            if (hasResult) {
                self(time);
            } else {
                observer.onCompleted();
            }
        });
    });
};
Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    return observableCreateWithDisposable(function (observer) {
        var first = true,
            hasResult = false,
            result,
            state = initialState, 
            time;
        return scheduler.scheduleRecursiveWithRelative(0, function (self) {
            if (hasResult) {
                observer.onNext(result);
            }
            try {
                if (first) {
                    first = false;
                } else {
                    state = iterate(state);
                }
                hasResult = condition(state);
                if (hasResult) {
                    result = resultSelector(state);
                    time = timeSelector(state);
                }
            } catch (e) {
                observer.onError(e);
                return;
            }
            if (hasResult) {
                self(time);
            } else {
                observer.onCompleted();
            }
        });
    });
};
})(this);
