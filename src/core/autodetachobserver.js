    /** @private */
    var AutoDetachObserver = (function (_super) {
        inherits(AutoDetachObserver, _super);

        /**
         * @private
         * @constructor
         */
        function AutoDetachObserver(observer) {
            _super.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable();
        }

        var AutoDetachObserverPrototype = AutoDetachObserver.prototype

        /**
         * @private
         * @memberOf AutoDetachObserver#
         */
        AutoDetachObserverPrototype.next = function (value) {
            var noError = false;
            try {
                this.observer.onNext(value);
                noError = true;
            } catch (e) { 
                throw e;                
            } finally {
                if (!noError) {
                    this.dispose();
                }
            }
        };

        /**
         * @private
         * @memberOf AutoDetachObserver#
         */
        AutoDetachObserverPrototype.error = function (exn) {
            try {
                this.observer.onError(exn);
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };

        /**
         * @private
         * @memberOf AutoDetachObserver#
         */
        AutoDetachObserverPrototype.completed = function () {
            try {
                this.observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };

        /**
         * @private
         * @memberOf AutoDetachObserver#
         */
        AutoDetachObserverPrototype.disposable = function (value) {
            return this.m.disposable(value);
        };

        /**
         * @private
         * @memberOf AutoDetachObserver#
         */
        AutoDetachObserverPrototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.m.dispose();
        };

        return AutoDetachObserver;
    }(AbstractObserver));
