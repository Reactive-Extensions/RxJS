  
  var scheduleMethod, clearMethod = noop;
  (function () {

      var reNative = RegExp('^' +
        String(toString)
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/toString| for [^\]]+/g, '.*?') + '$'
      );

      var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
        !reNative.test(setImmediate) && setImmediate,
        clearImmediate = typeof (clearImmediate = freeGlobal && moduleExports && freeGlobal.clearImmediate) == 'function' &&
        !reNative.test(clearImmediate) && clearImmediate;

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

      // Use in order, nextTick, setImmediate, postMessage, MessageChannel, script readystatechanged, setTimeout
      if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
        scheduleMethod = process.nextTick;
      } else if (typeof setImmediate === 'function') {
        scheduleMethod = setImmediate;
        clearMethod = clearImmediate;
      } else if (postMessageSupported()) {
          var MSG_PREFIX = 'ms.rx.schedule' + Math.random(),
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

          scheduleMethod = function (action) {
            var currentId = taskId++;
            tasks[currentId] = action;
            root.postMessage(MSG_PREFIX + currentId, '*');
          };
      } else if (!!root.MessageChannel) {
          var channel = new root.MessageChannel(),
            channelTasks = {},
            channelTaskId = 0;

          channel.port1.onmessage = function (event) {
            var id = event.data,
              action = channelTasks[id];
            action();
            delete channelTasks[id];
          };

          scheduleMethod = function (action) {
            var id = channelTaskId++;
            channelTasks[id] = action;
            channel.port2.postMessage(id);     
          };
      } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
          
        scheduleMethod = function (action) {
          var scriptElement = root.document.createElement('script');
          scriptElement.onreadystatechange = function () { 
            action();
            scriptElement.onreadystatechange = null;
            scriptElement.parentNode.removeChild(scriptElement);
            scriptElement = null;  
          };
          root.document.documentElement.appendChild(scriptElement);  
        };

      } else {
        scheduleMethod = function (action) { return setTimeout(action, 0); };
        clearMethod = clearTimeout;
      }
  }());

  /** 
   * Gets a scheduler that schedules work via a timed callback based upon platform.
   */
  var timeoutScheduler = Scheduler.timeout = (function () {

    function scheduleNow(state, action) {
        var scheduler = this,
          disposable = new SingleAssignmentDisposable();
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
        var scheduler = this,
          dt = Scheduler.normalize(dueTime);
        if (dt === 0) {
          return scheduler.scheduleWithState(state, action);
        }
        var disposable = new SingleAssignmentDisposable();
        var id = setTimeout(function () {
          if (!disposable.isDisposed) {
            disposable.setDisposable(action(scheduler, state));
          }
        }, dt);
        return new CompositeDisposable(disposable, disposableCreate(function () {
          clearTimeout(id);
        }));
    }

    function scheduleAbsolute(state, dueTime, action) {
      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
    }

    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
  })();
