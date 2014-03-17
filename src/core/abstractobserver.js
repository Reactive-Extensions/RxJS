    /**
     * Abstract base class for implementations of the Observer class.
     * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages. 
     */
    var AbstractObserver = Rx.internals.AbstractObserver = (function (_super) {
        inherits(AbstractObserver, _super);

        /**
         * Creates a new observer in a non-stopped state.
         *
         * @constructor
         */
        function AbstractObserver() {
            this.isStopped = false;
            _super.call(this);
        }

        /**
         * Notifies the observer of a new element in the sequence.
         *  
         * @memberOf AbstractObserver
         * @param {Any} value Next element in the sequence. 
         */
        AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
                this.next(value);
            }
        };

        /**
         * Notifies the observer that an exception has occurred.
         * 
         * @memberOf AbstractObserver
         * @param {Any} error The error that has occurred.     
         */    
        AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };

        /**
         * Notifies the observer of the end of the sequence.
         */    
        AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };

        /**
         * Disposes the observer, causing it to transition to the stopped state.
         */
        AbstractObserver.prototype.dispose = function () {
            this.isStopped = true;
        };

        AbstractObserver.prototype.fail = function (e) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(e);
                return true;
            }

            return false;
        };

        return AbstractObserver;
    }(Observer));
