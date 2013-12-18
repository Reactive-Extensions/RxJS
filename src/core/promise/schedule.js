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

    // Node.js
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

            root.addEventListener('unload', function () {
                observer.disconnect();
                observer = null;
            });

            return function () {
                element.setAttribute('drainQueue', 'drainQueue');
            };
        };

    }());

    // Check for post message
    function postMessageSupported () {
        // Ensure not in a worker
        if (!root.postMessage || root.importScripts) { return false; }
        var isAsync = false, 
            oldHandler = root.onmessage;
        // Test for async
        root.onmessage = function () { isAsync = true; };
        root.postMessage('','*');
        root.onmessage = oldHandler;

        return isAsync;
    }

    function usePostMessage () {
        var MSG_PREFIX = 'ms.rx.promise' + Math.random(),
            tasks = {},
            taskId = 0;

        function onGlobalPostMessage(event) {
            // Only if we're a match to avoid any other global events
            if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
                var handleId = event.data.substring(MSG_PREFIX.length),
                    action = tasks[handleId];
                action();
                delete tasks[handleId];
            }
        }

        if (root.addEventListener) {
            root.addEventListener('message', onGlobalPostMessage, false);
        } else {
            root.attachEvent('onmessage', onGlobalPostMessage, false);
        }

        return function () {
            var currentId = taskId++;
            tasks[currentId] = drainQueue;
            root.postMessage(MSG_PREFIX + currentId, '*');
        };        
    }

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
        if (typeof process !== 'undefined' && toString.call(process) === '[object process]') {
            return useNextTick();
        }
        if (!!setImmediate) {
            return useSetImmediate();
        }
        if (!!root.MessageChannel) {
            return useMessageChannel();
        }
        if (postMessageSupported()) {
            return usePostMessage();
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
