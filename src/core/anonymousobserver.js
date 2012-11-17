    var AnonymousObserver = root.AnonymousObserver = (function () {
        inherits(AnonymousObserver, AbstractObserver);
        function AnonymousObserver(onNext, onError, onCompleted) {
            AnonymousObserver.super_.constructor.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }
        AnonymousObserver.prototype.next = function (value) {
            this._onNext(value);
        };
        AnonymousObserver.prototype.error = function (exception) {
            this._onError(exception);
        };
        AnonymousObserver.prototype.completed = function () {
            this._onCompleted();
        };
        return AnonymousObserver;
    }());
