    // Observable extensions
    observableProto.and = function (right) {
        /// <summary>
        /// Creates a pattern that matches when both observable sequences have an available value.
        /// </summary>
        /// <param name="right">Observable sequence to match with the current sequence.</param>
        /// <returns>Pattern object that matches when both observable sequences have an available value.</returns>
        return new Pattern([this, right]);
    };
    observableProto.then = function (selector) {
        /// <summary>
        /// Matches when the observable sequence has an available value and projects the value.
        /// </summary>
        /// <param name="selector">Selector that will be invoked for values in the source sequence.</param>
        /// <returns>Plan that produces the projected values, to be fed (with other plans) to the when operator.</returns>
        return new Pattern([this]).then(selector);
    };
    Observable.when = function () {
        /// <summary>
        /// Joins together the results from several patterns.
        /// </summary>
        /// <param name="plans">A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.</param>
        /// <returns>Observable sequence with the results form matching several patterns.</returns>
        var plans = argsOrArray(arguments, 0);
        return new AnonymousObservable(function (observer) {
            var activePlans = [],
                externalSubscriptions = new Map(),
                group,
                i, len,
                joinObserver,
                joinValues,
                outObserver;
            outObserver = observerCreate(observer.onNext.bind(observer), function (exception) {
                var values = externalSubscriptions.getValues();
                for (var j = 0, jlen = values.length; j < jlen; j++) {
                    values[j].onError(exception);
                }
                observer.onError(exception);
            }, observer.onCompleted.bind(observer));
            try {
                for (i = 0, len = plans.length; i < len; i++) {
                    activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
                        var idx = activePlans.indexOf(activePlan);
                        activePlans.splice(idx, 1);
                        if (activePlans.length === 0) {
                            outObserver.onCompleted();
                        }
                    }));
                }
            } catch (e) {
                observableThrow(e).subscribe(observer);
            }
            group = new CompositeDisposable();
            joinValues = externalSubscriptions.getValues();
            for (i = 0, len = joinValues.length; i < len; i++) {
                joinObserver = joinValues[i];
                joinObserver.subscribe();
                group.add(joinObserver);
            }
            return group;
        });
    };
    
