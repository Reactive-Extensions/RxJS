    /**
     *  Abstract base class for implementations of the IObserver&lt;T&gt; interface.
     *  
     *   This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages. 
     */
    var AbstractObserver = root.Internals.AbstractObserver = (function () {
        inherits(AbstractObserver, Observer);

        /**
         * @constructor
         * Creates a new observer in a non-stopped state.
         */
        function AbstractObserver() {
            this.isStopped = false;
        }

        /**
         *  Notifies the observer of a new element in the sequence.
         *  
         *  @param value Next element in the sequence. 
         */
        AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
                this.next(value);
            }
        };

        /**
         *  Notifies the observer that an exception has occurred.
         *  
         *  @param error The error that has occurred.     
         */    
        AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };

        /**
         *  Notifies the observer of the end of the sequence.
         */    
        AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };

        /**
         *  Disposes the observer, causing it to transition to the stopped state.
         */
        AbstractObserver.prototype.dispose = function () {
            this.isStopped = true;
        };

        AbstractObserver.prototype.fail = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(true);
                return true;
            }

            return false;
        };

        return AbstractObserver;
    }());
