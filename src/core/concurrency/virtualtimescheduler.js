    /** Provides a set of extension methods for virtual time scheduling. */
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

        /**
         * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
         * @param initialClock Initial value for the clock.
         * @param comparer Comparer to determine causality of events based on absolute time.
         */
        function VirtualTimeScheduler(initialClock, comparer) {
            this.clock = initialClock;
            this.comparer = comparer;
            this.isEnabled = false;
            this.queue = new PriorityQueue(1024);
            VirtualTimeScheduler.super_.constructor.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        }

        addProperties(VirtualTimeScheduler.prototype, {
            /**
             * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
             * 
             * @param state Initial state passed to the action upon the first iteration.
             * @param period Period for running the work periodically.
             * @param action Action to be executed, potentially updating the state.
             * @return The disposable object used to cancel the scheduled recurring action (best effort).
             */      
            schedulePeriodicWithState: function (state, period, action) {
                var s = new SchedulePeriodicRecursive(this, state, period, action);
                return s.start();
            },
            /**
             * Schedules an action to be executed after dueTime.
             * 
             * @param state State passed to the action to be executed.
             * @param dueTime Relative time after which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */            
            scheduleRelativeWithState: function (state, dueTime, action) {
                var runAt = this.add(this.clock, dueTime);
                return this.scheduleAbsoluteWithState(state, runAt, action);
            },
            /**
             * Schedules an action to be executed at dueTime.
             * 
             * @param dueTime Relative time after which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */          
            scheduleRelative: function (dueTime, action) {
                return this.scheduleRelativeWithState(action, dueTime, invokeAction);
            },
            /** Starts the virtual time scheduler. */
            start: function () {
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
            /** Stops the virtual time scheduler. */
            stop: function () {
                this.isEnabled = false;
            },
            /**
             * Advances the scheduler's clock to the specified time, running all work till that point.
             * @param time Absolute time to advance the scheduler's clock to.
             */
            advanceTo: function (time) {
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
            /**
             * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
             * @param time Relative time to advance the scheduler's clock by.
             */
            advanceBy: function (time) {
                var dt = this.add(this.clock, time);
                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }
                return this.advanceTo(dt);
            },
            /**
             * Advances the scheduler's clock by the specified relative time.
             * @param time Relative time to advance the scheduler's clock by.
             */
            sleep: function (time) {
                var dt = this.add(this.clock, time);

                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }

                this.clock = dt;
            },
            /**
             * Gets the next scheduled item to be executed.
             * @return The next scheduled item.
             */          
            getNext: function () {
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
            /**
             * Schedules an action to be executed at dueTime.
             * @param scheduler Scheduler to execute the action on.
             * @param dueTime Absolute time at which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */           
            scheduleAbsolute: function (dueTime, action) {
                return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
            },
            /**
             * Schedules an action to be executed at dueTime.
             * @param state State passed to the action to be executed.
             * @param dueTime Absolute time at which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */
            scheduleAbsoluteWithState: function (state, dueTime, action) {
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
