    var GroupedObservable = (function () {
        function subscribe(observer) {
            return this.underlyingObservable.subscribe(observer);
        }

        inherits(GroupedObservable, Observable);
        function GroupedObservable(key, underlyingObservable, mergedDisposable) {
            GroupedObservable.super_.constructor.call(this, subscribe);
            this.key = key;
            this.underlyingObservable = !mergedDisposable ?
                underlyingObservable :
                new AnonymousObservable(function (observer) {
                    return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
                });
        }
        return GroupedObservable;
    }());
