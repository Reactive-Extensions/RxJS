    var AutoDetachObserver = (function () {

        inherits(AutoDetachObserver, AbstractObserver);
        function AutoDetachObserver(observer) {
            AutoDetachObserver.super_.constructor.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable();
        }

        AutoDetachObserver.prototype.next = function (value) {
            var noError = false;
            try {
                this.observer.onNext(value);
                noError = true;
            } finally {
                if (!noError) {
                    this.dispose();
                }
            }
        };
        AutoDetachObserver.prototype.error = function (exn) {
            try {
                this.observer.onError(exn);
            } finally {
                this.dispose();
            }
        };
        AutoDetachObserver.prototype.completed = function () {
            try {
                this.observer.onCompleted();
            } finally {
                this.dispose();
            }
        };
        AutoDetachObserver.prototype.disposable = function (value) {
            return this.m.disposable(value);
        };
        AutoDetachObserver.prototype.dispose = function () {
            AutoDetachObserver.super_.dispose.call(this);
            this.m.dispose();
        };

        return AutoDetachObserver;
    }());
