    /** 
     * Gets a scheduler that schedules work via a timed callback based upon platform.
     *
     * @memberOf Scheduler
     */
    var timeoutScheduler = Scheduler.timeout = (function () {

        function postMessageSupported () {
            // Ensure not in a worker
            if (!window.postMessage || window.importScripts) { return false; }
            var isAsync = false, 
                oldHandler = window.onmessage;
            // Test for async
            window.onmessage = function () { isAsync = true; };
            window.postMessage('','*');
            window.onmessage = oldHandler;

            return isAsync;
        }

        var scheduleMethod, clearMethod = noop;
        if (typeof window.process !== 'undefined' && typeof window.process.nextTick === 'function') {
            scheduleMethod = window.process.nextTick;
        } else if (typeof window.setImmediate === 'function') {
            scheduleMethod = window.setImmediate;
            clearMethod = window.clearImmediate;
        } else if (postMessageSupported()) {
            var MSG_PREFIX = 'ms.rx.schedule' + Math.random(),
                tasks = {},
                taskId = 0;

            function onGlobalPostMessage(event) {
                if (event.source === window && typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
                    var handleId = event.data.substring(MSG_PREFIX.length),
                        action = tasks[handleId];
                    action();
                    delete tasks[handleId];
                }
            }

            if (window.addEventListener) {
                window.addEventListener('message', onGlobalPostMessage, false);
            } else {
                window.attachEvent('message', onGlobalPostMessage, false);
            }

            scheduleMethod = function (action) {
                var currentId = taskId++;
                tasks[currentId] = action;
                window.postMessage(MSG_PREFIX + currentId, '*');
            };
        } else if (!!window.MessageChannel) {
            scheduleMethod = function (action) {
                var channel = new window.MessageChannel();
                channel.port1.onmessage = function (event) {
                    action();
                };
                channel.port2.postMessage();     
            };
        } else if ('document' in window && 'onreadystatechange' in window.document.createElement('script');) {
            var scriptElement = window.document.createElement('script');
            scriptElement.onreadystatechange = function () { 
                action();
                scriptElement.onreadystatechange = null;
                scriptElement.parentNode.removeChild(scriptElement);
                scriptElement = null;  
            };
            window.document.documentElement.appendChild(scriptElement);   
        } else {
            scheduleMethod = function (action) { return window.setTimeout(action, 0); };
            clearMethod = window.clearTimeout;
        }

        function scheduleNow(state, action) {
            var scheduler = this;
            var disposable = new SingleAssignmentDisposable();
            var id = scheduleMethod(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
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
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
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
