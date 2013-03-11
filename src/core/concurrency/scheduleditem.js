    /** 
    * @private 
    * @constructor
    */
    function ScheduledItem(scheduler, state, action, dueTime, comparer) {
        this.scheduler = scheduler;
        this.state = state;
        this.action = action;
        this.dueTime = dueTime;
        this.comparer = comparer || defaultSubComparer;
        this.disposable = new SingleAssignmentDisposable();
    }

    /** 
    * @private 
    * @memberOf ScheduledItem#
    */
    ScheduledItem.prototype.invoke = function () {
        this.disposable.disposable(this.invokeCore());
    };

    /** 
    * @private 
    * @memberOf ScheduledItem#
    */
    ScheduledItem.prototype.compareTo = function (other) {
        return this.comparer(this.dueTime, other.dueTime);
    };

    /** 
    * @private 
    * @memberOf ScheduledItem#
    */
    ScheduledItem.prototype.isCancelled = function () {
        return this.disposable.isDisposed;
    };

    /** 
    * @private 
    * @memberOf ScheduledItem#
    */
    ScheduledItem.prototype.invokeCore = function () {
        return this.action(this.scheduler, this.state);
    };
