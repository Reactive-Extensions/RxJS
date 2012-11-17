    // Virtual Scheduler
    root.VirtualTimeScheduler = (function () {

        function localNow() {
            return this.toDateTimeOffset(this.clock);
        }

        function scheduleNow(state, action) {
            return this.scheduleAbsoluteWithState(state, this.clock, action);
        }

        function scheduleRelative(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime), action);
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime - this.now()), action);
        }

        function invokeAction(scheduler, action) {
            action();
            return disposableEmpty;
        }

        inherits(VirtualTimeScheduler, Scheduler);

        function VirtualTimeScheduler(initialClock, comparer) {
            /// <summary>
            /// Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
            /// </summary>
            /// <param name="initialClock">Initial value for the clock.</param>
            /// <param name="comparer">Comparer to determine causality of events based on absolute time.</param>
            this.clock = initialClock;
            this.comparer = comparer;
            this.isEnabled = false;
            this.queue = new PriorityQueue(1024);
            VirtualTimeScheduler.super_.constructor.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        }

        addProperties(VirtualTimeScheduler.prototype, {
            schedulePeriodicWithState: function (state, period, action) {
                /// <summary>
                /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
                /// </summary>
                /// <param name="state">Initial state passed to the action upon the first iteration.</param>
                /// <param name="period">Period for running the work periodically.</param>
                /// <param name="action">Action to be executed, potentially updating the state.</param>
                /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
                var s = new SchedulePeriodicRecursive(this, state, period, action);
                return s.start();
            },
            scheduleRelativeWithState: function (state, dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed after dueTime.
                /// </summary>
                /// <param name="state">State passed to the action to be executed.</param>
                /// <param name="dueTime">Relative time after which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                var runAt = this.add(this.clock, dueTime);
                return this.scheduleAbsoluteWithState(state, runAt, action);
            },
            scheduleRelative: function (dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="dueTime">Relative time after which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                return this.scheduleRelativeWithState(action, dueTime, invokeAction);
            },
            start: function () {
                /// <summary>
                /// Starts the virtual time scheduler.
                /// </summary>
                var next;
                if (!this.isEnabled) {
                    this.isEnabled = true;
                    do {
                        next = this.getNext();
                        if (next !== null) {
                            if (this.comparer(next.dueTime, this.clock) > 0) {
                                this.clock = next.dueTime;
                            }
                            next.invoke();
                        } else {
                            this.isEnabled = false;
                        }
                    } while (this.isEnabled);
                }
            },
            stop: function () {
                /// <summary>
                /// Stops the virtual time scheduler.
                /// </summary>
                this.isEnabled = false;
            },
            advanceTo: function (time) {
                /// <summary>
                /// Advances the scheduler's clock to the specified time, running all work till that point.
                /// </summary>
                /// <param name="time">Absolute time to advance the scheduler's clock to.</param>
                var next;
                if (this.comparer(this.clock, time) >= 0) {
                    throw new Error(argumentOutOfRange);
                }
                if (!this.isEnabled) {
                    this.isEnabled = true;
                    do {
                        next = this.getNext();
                        if (next !== null && this.comparer(next.dueTime, time) <= 0) {
                            if (this.comparer(next.dueTime, this.clock) > 0) {
                                this.clock = next.dueTime;
                            }
                            next.invoke();
                        } else {
                            this.isEnabled = false;
                        }
                    } while (this.isEnabled)
                    this.clock = time;
                }
            },
            advanceBy: function (time) {
                /// <summary>
                /// Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
                /// </summary>
                /// <param name="time">Relative time to advance the scheduler's clock by.</param>
                var dt = this.add(this.clock, time);
                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }
                return this.advanceTo(dt);
            },
            sleep: function (time) {
                /// <summary>
                /// Advances the scheduler's clock by the specified relative time.
                /// </summary>
                /// <param name="time">Relative time to advance the scheduler's clock by.</param>
                var dt = this.add(this.clock, time);

                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }

                this.clock = dt;
            },
            getNext: function () {
                /// <summary>
                /// Gets the next scheduled item to be executed.
                /// </summary>
                /// <returns>The next scheduled item.</returns>
                var next;
                while (this.queue.length > 0) {
                    next = this.queue.peek();
                    if (next.isCancelled()) {
                        this.queue.dequeue();
                    } else {
                        return next;
                    }
                }
                return null;
            },
            scheduleAbsolute: function (dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="scheduler">Scheduler to execute the action on.</param>
                /// <param name="dueTime">Absolute time at which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
            },
            scheduleAbsoluteWithState: function (state, dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="state">State passed to the action to be executed.</param>
                /// <param name="dueTime">Absolute time at which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                var self = this,
                    run = function (scheduler, state1) {
                        self.queue.remove(si);
                        return action(scheduler, state1);
                    },
                    si = new ScheduledItem(self, state, run, dueTime, self.comparer);
                self.queue.enqueue(si);
                return si.disposable;
            }
        });

        return VirtualTimeScheduler;
    }());
