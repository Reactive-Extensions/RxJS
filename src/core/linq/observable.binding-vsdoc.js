    var Observable = root.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = root.Internals.AnonymousObservable,
        Subject = root.Subject,
        AsyncSubject = root.AsyncSubject,
        Observer = root.Observer,
        ScheduledObserver = root.Internals.ScheduledObserver,
        disposableCreate = root.Disposable.create,
        disposableEmpty = root.Disposable.empty,
        CompositeDisposable = root.CompositeDisposable,
        currentThreadScheduler = root.Scheduler.currentThread,
        inherits = root.Internals.inherits,
        addProperties = root.Internals.addProperties;

    // Utilities
    var objectDisposed = 'Object has been disposed';
    function checkDisposed() {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    }

    observableProto.multicast = function (subjectOrSubjectSelector, selector) {
        /// <summary>
        /// Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
        /// subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
        /// invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
        /// &#10;
        /// &#10;1 - res = source.multicast(observable);
        /// &#10;2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
        /// </summary>
        /// <param name="subjectOrSubjectSelector">
        /// Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
        /// Or:
        /// Subject to push source elements into.
        /// </param>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        var source = this;
        return typeof subjectOrSubjectSelector === 'function' ?
            new AnonymousObservable(function (observer) {
                var connectable = source.multicast(subjectOrSubjectSelector());
                return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
            }) :
            new ConnectableObservable(source, subjectOrSubjectSelector);
    };

    observableProto.publish = function (selector) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
        /// This operator is a specialization of Multicast using a regular Subject.
        /// &#10;
        /// &#10;1 - res = source.publish();
        /// &#10;2 - res = source.publish(function (x) { return x; });
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new Subject()) :
            this.multicast(function () {
                return new Subject();
            }, selector);
    };

    observableProto.publishLast = function (selector) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
        /// This operator is a specialization of Multicast using a AsyncSubject.
        /// &#10;
        /// &#10;1 - res = source.publishLast();
        /// &#10;2 - res = source.publishLast(function (x) { return x; });
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new AsyncSubject()) :
            this.multicast(function () {
                return new AsyncSubject();
            }, selector);
    };

    observableProto.publishValue = function (initialValueOrSelector, initialValue) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
        /// This operator is a specialization of Multicast using a BehaviorSubject.
        /// &#10;
        /// &#10;1 - res = source.publishValue(42);
        /// &#10;2 - res = source.publishLast(function (x) { return x.select(function (y) { return y * y; }) }, 42);
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.</param>
        /// <param name="initialValue">Initial value received by observers upon subscription.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return arguments.length === 2 ?
            this.multicast(function () {
                return new BehaviorSubject(initialValue);
            }, initialValueOrSelector) :
            this.multicast(new BehaviorSubject(initialValueOrSelector));
    };

    observableProto.replay = function (selector, bufferSize, window, scheduler) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
        /// This operator is a specialization of Multicast using a ReplaySubject.
        /// &#10;
        /// &#10;1 - res = source.replay(null, 3);
        /// &#10;2 - res = source.replay(null, 3, 500 /* ms */);
        /// &#10;3 - res = source.replay(null, 3, 500 /* ms */, /* scheduler */);
        /// &#10;3 - res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500 /* ms */, /* scheduler */);
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.</param>
        /// <param name="bufferSize">[Optional] Maximum element count of the replay buffer.</param>
        /// <param name="window">[Optional] Maximum time length of the replay buffer.</param>
        /// <param name="scheduler">[Optional] Scheduler where connected observers within the selector function will be invoked on.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new ReplaySubject(bufferSize, window, scheduler)) :
            this.multicast(function () {
                return new ReplaySubject(bufferSize, window, scheduler);
            }, selector);
    };
