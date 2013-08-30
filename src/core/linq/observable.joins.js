    // Observable extensions
    
    /**
     *  Creates a pattern that matches when both observable sequences have an available value.
     *  
     *  @param right Observable sequence to match with the current sequence.
     *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.     
     */
    observableProto.and = function (right) {
        return new Pattern([this, right]);
    };

    /**
     *  Matches when the observable sequence has an available value and projects the value.
     *  
     *  @param selector Selector that will be invoked for values in the source sequence.
     *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator. 
     */    
    observableProto.then = function (selector) {
        return new Pattern([this]).then(selector);
    };

    /**
     *  Joins together the results from several patterns.
     *  
     *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
     *  @returns {Observable} Observable sequence with the results form matching several patterns. 
     */
    Observable.when = function () {
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
