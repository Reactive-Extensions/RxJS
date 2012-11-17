    var AnonymousSubject = (function () {
        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        inherits(AnonymousSubject, Observable);
        function AnonymousSubject(observer, observable) {
            AnonymousSubject.super_.constructor.call(this, subscribe);
            this.observer = observer;
            this.observable = observable;
        }

        addProperties(AnonymousSubject.prototype, Observer, {
            onCompleted: function () {
                this.observer.onCompleted();
            },
            onError: function (exception) {
                this.observer.onError(exception);
            },
            onNext: function (value) {
                this.observer.onNext(value);
            }
        });

        return AnonymousSubject;
    }());
