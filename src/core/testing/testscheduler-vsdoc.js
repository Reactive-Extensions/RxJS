    root.TestScheduler = (function () {
        inherits(TestScheduler, VirtualTimeScheduler);
        function TestScheduler() {
            TestScheduler.super_.constructor.call(this, 0, function (a, b) { return a - b; });
        }

        TestScheduler.prototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed at the specified virtual time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="dueTime">Absolute virtual time at which to execute the action.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>Disposable object used to cancel the scheduled action (best effort).</returns>
            if (dueTime <= this.clock) {
                dueTime = this.clock + 1;
            }
            return TestScheduler.super_.scheduleAbsoluteWithState.call(this, state, dueTime, action);
        };
        TestScheduler.prototype.add = function (absolute, relative) {
            /// <summary>
            /// Adds a relative virtual time to an absolute virtual time value.
            /// </summary>
            /// <param name="absolute">Absolute virtual time value.</param>
            /// <param name="relative">Relative virtual time value to add.</param>
            /// <returns>Resulting absolute virtual time sum value.</returns>
            return absolute + relative;
        };
        TestScheduler.prototype.toDateTimeOffset = function (absolute) {
            /// <summary>
            /// Converts the absolute virtual time value to a DateTimeOffset value.
            /// </summary>
            /// <param name="absolute">Absolute virtual time value to convert.</param>
            /// <returns>Corresponding DateTimeOffset value.</returns>
            return new Date(absolute).getTime();
        };
        TestScheduler.prototype.toRelative = function (timeSpan) {
            /// <summary>
            /// Converts the TimeSpan value to a relative virtual time value.
            /// </summary>
            /// <param name="timeSpan">TimeSpan value to convert.</param>
            /// <returns>Corresponding relative virtual time value.</returns>
            return timeSpan;
        };
        TestScheduler.prototype.startWithTiming = function (create, created, subscribed, disposed) {
            /// <summary>
            /// Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <param name="created">Virtual time at which to invoke the factory to create an observable sequence.</param>
            /// <param name="subscribed">Virtual time at which to subscribe to the created observable sequence.</param>
            /// <param name="disposed">Virtual time at which to dispose the subscription.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
            var observer = this.createObserver(), source, subscription;
            this.scheduleAbsoluteWithState(null, created, function () {
                source = create();
                return disposableEmpty;
            });
            this.scheduleAbsoluteWithState(null, subscribed, function () {
                subscription = source.subscribe(observer);
                return disposableEmpty;
            });
            this.scheduleAbsoluteWithState(null, disposed, function () {
                subscription.dispose();
                return disposableEmpty;
            });
            this.start();
            return observer;
        };
        TestScheduler.prototype.startWithDispose = function (create, disposed) {
            /// <summary>
            /// Starts the test scheduler and uses the specified virtual time to dispose the subscription to the sequence obtained through the factory function.
            /// Default virtual times are used for factory invocation and sequence subscription.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <param name="disposed">Virtual time at which to dispose the subscription.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, disposed);
        };
        TestScheduler.prototype.startWithCreate = function (create) {
            /// <summary>
            /// Starts the test scheduler and uses default virtual times to invoke the factory function, to subscribe to the resulting sequence, and to dispose the subscription</see>.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, ReactiveTest.disposed);
        };
        TestScheduler.prototype.createHotObservable = function () {
            /// <summary>
            /// Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
            /// </summary>
            /// <param name="messages">Notifications to surface through the created sequence at their specified absolute virtual times.</param>
            /// <returns>Hot observable sequence that can be used to assert the timing of subscriptions and notifications.</returns>
            var messages = argsOrArray(arguments, 0);
            return new HotObservable(this, messages);
        };
        TestScheduler.prototype.createColdObservable = function () {
            /// <summary>
            /// Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
            /// </summary>
            /// <param name="messages">Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.</param>
            /// <returns>Cold observable sequence that can be used to assert the timing of subscriptions and notifications.</returns>
            var messages = argsOrArray(arguments, 0);
            return new ColdObservable(this, messages);
        };
        TestScheduler.prototype.createObserver = function () {
            /// <summary>
            /// Creates an observer that records received notification messages and timestamps those.
            /// </summary>
            /// <typeparam name="T">The element type of the observer being created.</typeparam>
            /// <returns>Observer that can be used to assert the timing of received notifications.</returns>
            return new MockObserver(this);
        };

        return TestScheduler;
    })();
