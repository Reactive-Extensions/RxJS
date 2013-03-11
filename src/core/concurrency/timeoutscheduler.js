    /** 
     * Gets a scheduler that schedules work via a timed callback based upon platform.
     *
     * @memberOf Scheduler
     */
    var timeoutScheduler = Scheduler.timeout = (function () {

        var REQ_NAME = 'equestAnimationFrame',
            CANCEL_NAME = 'ancelAnimationFrame';

        // Optimize for speed
        var reqAnimFrame = window['r' + REQ_NAME] ||
            window['webkitR' + REQ_NAME] ||
            window['mozR' + REQ_NAME] ||
            window['oR' + REQ_NAME] ||
            window['msR' + REQ_NAME],
        clearAnimFrame = window['c' + CANCEL_NAME] ||
            window['webkitC' + CANCEL_NAME] ||
            window['mozC' + CANCEL_NAME] ||
            window['oC' + CANCEL_NAME] ||
            window['msC' + CANCEL_NAME];

        var scheduleMethod, clearMethod;
        if (typeof window.process !== 'undefined' && typeof window.process.nextTick === 'function') {
            scheduleMethod = window.process.nextTick;
            clearMethod = noop;
        } else if (typeof window.setImmediate === 'function') {
            scheduleMethod = window.setImmediate;
            clearMethod = window.clearImmediate;
        } else if (typeof reqAnimFrame === 'function') {
            scheduleMethod = reqAnimFrame;
            clearMethod = clearAnimFrame;
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
