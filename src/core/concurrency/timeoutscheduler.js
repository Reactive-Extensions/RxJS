    /** 
     * Gets a scheduler that schedules work via a timed callback based upon platform.
     *
     * @memberOf Scheduler
     */
    var timeoutScheduler = Scheduler.timeout = (function () {

        function OnReadyStateScheduler() {
            this.scriptElement = null;
        }
        OnReadyStateScheduler.prototype.scheduleMethod = function (action) {
            this.scriptElement = window.document.createElement('script'), self = this;
            scriptElement.onreadystatechange = function () {
                if (self.scriptElement) {
                    action();
                    self.scriptElement.onreadystatechange = null;
                    self.scriptElement.parentNode.removeChild(self.scriptElement);
                    self.scriptElement = null;                
                }
            };
            window.document.documentElement.appendChild(this.scriptElement);            
        };
        OnReadyStateScheduler.prototype.clearMethod = function () {
            if (this.scriptElement) {
                this.scriptElement.onreadystatechange = null;
                this.scriptElement.parentNode.removeChild(self.scriptElement);
                this.scriptElement = null;                
            }
        };

        var scheduleMethod, clearMethod = noop;
        if (typeof window.process !== 'undefined' && typeof window.process.nextTick === 'function') {
            scheduleMethod = window.process.nextTick;
        } else if (typeof window.setImmediate === 'function') {
            scheduleMethod = window.setImmediate;
            clearMethod = window.clearImmediate;
        } else if (!!window.MessageChannel) {
            scheduleMethod = function (action) {
                var channel = new window.MessageChannel();
                channel.port1.onmessage = function (event) {
                    action();
                };
                channel.port2.postMessage();     
            };
        } else if ('document' in window && 'onreadystatechange' in window.document.createElement('script');) {
            var onReadyScheduler = new OnReadyStateScheduler();
            scheduleMethod = onReadyScheduler.scheduleMethod.bind(onReadyScheduler);
            clearMethod = onReadyScheduler.clearMethod.bind(onReadyScheduler);
        } else {
            scheduleMethod = function (action) { return window.setTimeout(action, 0); };
            clearMethod = window.clearTimeout;
        }

        function scheduleNow(state, action) {
            var scheduler = this;
            var disposable = new SingleAssignmentDisposable();
            var id = scheduleMethod(function () {
                disposable.setDisposable(action(scheduler, state));
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                clearMethod(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this;
            var dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }
            var disposable = new SingleAssignmentDisposable();
            var id = window.setTimeout(function () {
                disposable.setDisposable(action(scheduler, state));
            }, dt);
            return new CompositeDisposable(disposable, disposableCreate(function () {
                window.clearTimeout(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
    })();
