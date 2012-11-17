    var Scheduler = root.Scheduler = (function () {
        function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
            this.now = now;
            this._schedule = schedule;
            this._scheduleRelative = scheduleRelative;
            this._scheduleAbsolute = scheduleAbsolute;
        }

        function invokeRecImmediate(scheduler, pair) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2) {
                    var isAdded = false, isDone = false,
                    d = scheduler.scheduleWithState(state2, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeRecDate(scheduler, pair, method) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2, dueTime1) {
                    var isAdded = false, isDone = false,
                    d = scheduler[method].call(scheduler, state2, dueTime1, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeAction(scheduler, action) {
            action();
            return disposableEmpty;
        }

        var schedulerProto = Scheduler.prototype;
        schedulerProto.catchException = function (handler) {
            /// <summary>
            /// Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
            /// </summary>
            /// <param name="scheduler">Scheduler to apply an exception filter for.</param>
            /// <param name="handler">Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.</param>
            /// <returns>Wrapper around the original scheduler, enforcing exception handling.</returns>
            return new CatchScheduler(this, handler);
        };

        schedulerProto.schedulePeriodic = function (period, action) {
            /// <summary>
            /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
            /// </summary>
            /// <param name="period">Period for running the work periodically.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
            return this.schedulePeriodicWithState(null, period, function () {
                action();
            });
        };

        schedulerProto.schedulePeriodicWithState = function (state, period, action) {
            /// <summary>
            /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
            /// </summary>
            /// <param name="state">Initial state passed to the action upon the first iteration.</param>
            /// <param name="period">Period for running the work periodically.</param>
            /// <param name="action">Action to be executed, potentially updating the state.</param>
            /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
            var s = state, id = window.setInterval(function () {
                s = action(s);
            }, period);
            return disposableCreate(function () {
                window.clearInterval(id);
            });
        };

        schedulerProto.schedule = function (action) {
            /// <summary>
            /// Schedules an action to be executed.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._schedule(action, invokeAction);
        };

        schedulerProto.scheduleWithState = function (state, action) {
            /// <summary>
            /// Schedules an action to be executed.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._schedule(state, action);
        };

        schedulerProto.scheduleWithRelative = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed after the specified relative due time.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <param name="dueTime">Relative time after which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative(action, dueTime, invokeAction);
        };

        schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed after dueTime.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <param name="dueTime">Relative time after which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative(state, dueTime, action);
        };

        schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed at the specified absolute due time.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <param name="dueTime">Absolute time at which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute(action, dueTime, invokeAction);
        };

        schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed at dueTime.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <param name="dueTime">Absolute time at which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute(state, dueTime, action);
        };

        schedulerProto.scheduleRecursive = function (action) {
            /// <summary>
            /// Schedules an action to be executed recursively.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithState(action, function (_action, self) {
                _action(function () {
                    self(_action);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithState = function (state, action) {
            /// <summary>
            /// Schedules an action to be executed recursively.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleWithState({ first: state, second: action }, function (s, p) {
                return invokeRecImmediate(s, p);
            });
        };

        schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively after a specified relative due time.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.</param>
            /// <param name="dueTime">Relative time after which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively after a specified relative due time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.</param>
            /// <param name="dueTime">Relative time after which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
            });
        };

        schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively at a specified absolute due time.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.</param>
            /// <param name="dueTime">Absolute time at which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively at a specified absolute due time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.</param>
            /// <param name="dueTime">Absolute time at which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
            });
        };

        Scheduler.now = defaultNow;
        Scheduler.normalize = function (timeSpan) {
            if (timeSpan < 0) {
                timeSpan = 0;
            }
            return timeSpan;
        };

        return Scheduler;
    }());
