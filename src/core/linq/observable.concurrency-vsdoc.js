    observableProto.observeOn = function (scheduler) {
    /// <summary>
    /// Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
    /// </summary>
    /// <param name="scheduler">Scheduler to notify observers on.</param>
    /// <returns>The source sequence whose observations happen on the specified scheduler.</returns>
    /// <remarks>
    /// This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
    /// that require to be run on a scheduler, use subscribeOn.
    /// </remarks>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer));
        });
    };

    observableProto.subscribeOn = function (scheduler) {
    /// <summary>
    /// Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
    /// see the remarks section for more information on the distinction between subscribeOn and observeOn.
    /// </summary>
    /// <param name="scheduler">Scheduler to perform subscription and unsubscription actions on.</param>
    /// <returns>The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.</returns>
    /// <remarks>
    /// This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
    /// callbacks on a scheduler, use observeOn.
    /// </remarks>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
            d.setDisposable(m);
            m.setDisposable(scheduler.schedule(function () {
                d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)));
            }));
            return d;
        });
    };
    