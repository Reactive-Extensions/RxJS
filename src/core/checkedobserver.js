    var CheckedObserver = (function () {
        inherits(CheckedObserver, Observer);
        function CheckedObserver(observer) {
            this._observer = observer;
            this._state = 0; // 0 - idle, 1 - busy, 2 - done
        }

        CheckedObserver.prototype.onNext = function (value) {
            this.checkAccess();
            try {
                this._observer.onNext(value);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 0;
            }
        };

        CheckedObserver.prototype.onError = function (err) {
            this.checkAccess();
            try {
                this._observer.onError(err);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserver.prototype.onCompleted = function () {
            this.checkAccess();
            try {
                this._observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserver.prototype.checkAccess = function () {
            if (this._state === 1) { throw new Error('Re-entrancy detected'); }
            if (this._state === 2) { throw new Error('Observer completed'); }
            if (this._state === 0) { this._state = 1; }
        };

        return CheckedObserver;
    }());
