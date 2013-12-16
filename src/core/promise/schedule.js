    var reNative = RegExp('^' +
         String(toString)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
        !reNative.test(setImmediate) && setImmediate;

    // Check for setImmediate
    function useSetImmediate () {
        return function () {
            setImmediate(drainQueue);
        }
    }

    function useNextTick () {
        return function () {
            process.nextTick(drainQueue);
        }
    }

    var useMutationObserver = (function () {
        var MutationObserver = root.MutationObserver || root.WebKitMutationObserver;

        return function () {

            var observer = new MutationObserver(drainQueue),
                elem = document.createElement('div');
            observer.observe(element, { attributes: true });

            global.addEventListener('unload', function () {
                observer.disconnect();
                observer = null;
            });

            return function () {
                element.setAttribute('drainQueue', 'drainQueue');
            };
        };

    }());

    function useMessageChannel () {
        var channel = new root.MessageChannel(),
            channelTasks = {},
            channelTaskId = 0;

        channel.port1.onmessage = function (event) {
            var id = event.data,
                action = channelTasks[id];
            action();
            delete channelTasks[id];
        };

        return function () {
            var id = channelTaskId++;
            channelTasks[id] = drainQueue;
            channel.port2.postMessage(id);     
        };        
    }

    function useScriptReadyChange () {
        return function () {
            var scriptElement = root.document.createElement('script');
            scriptElement.onreadystatechange = function () { 
                drainQueue();
                scriptElement.onreadystatechange = null;
                scriptElement.parentNode.removeChild(scriptElement);
                scriptElement = null;  
            };
            root.document.documentElement.appendChild(scriptElement);  
        };        
    }

    function useSetTimeout () {
        return function () {
            global.setTimeout(drainQueue, 0);
        };
    }

    var scheduleMethod = (function () {
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
            return useNextTick();
        }
        if (typeof scheduleMethod === 'function') {
            return useSetImmediate();
        }
        if (!!root.MessageChannel) {
            return useMessageChannel();
        }
        if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
            return useScriptReadyChange();
        }

        return useSetTimeout();
    }());

    var queue = [];
    function drainQueue () {
        for (var i = 0, len = queue.length; i < len; i++) {
            var item = queue[i],
                cb = item.cb, arg = item.arg;
            cb(arg);
        }

        queue = [];
    }

    function runCallback (cb, arg) {
        var length = queue.push({cb: cb, arg: arg });
        if (length === 1) {
            scheduleMethod();
        }
    }

    var PromiseScheduler = (function () {

        function scheduleNow(state, action) {
            var scheduler = this,
                disposable = new SingleAssignmentDisposable();
            var id = scheduleMethod(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            });
            return new CompositeDisposable(disposable);
        }

        return function () {
            return new Scheduler(defaultNow, scheduleNow, notImeplented, notImeplented);
        }
    }());