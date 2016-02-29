'use strict';

var Disposable = require('../disposable');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var Scheduler = require('../scheduler');
var isFunction = require('../helpers/isfunction');
var noop = require('../helpers/noop');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;
var inherits = require('inherits');

var scheduleMethod, clearMethod;

(function () {

  var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

  clearMethod = function (handle) {
    delete tasksByHandle[handle];
  };

  function runTask(handle) {
    if (currentlyRunning) {
      global.setTimeout(function () { runTask(handle); }, 0);
    } else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunning = true;
        var result = tryCatch(task)();
        clearMethod(handle);
        currentlyRunning = false;
        if (result === global._Rx.errorObj) { thrower(result.e); }
      }
    }
  }

  var setImmediate = global.setImmediate;

  function postMessageSupported () {
    // Ensure not in a worker
    if (!global.postMessage || global.importScripts) { return false; }
    var isAsync = false, oldHandler = global.onmessage;
    // Test for async
    global.onmessage = function () { isAsync = true; };
    global.postMessage('', '*');
    global.onmessage = oldHandler;

    return isAsync;
  }

  // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
  if (isFunction(setImmediate)) {
    scheduleMethod = function (action) {
      var id = nextHandle++;
      tasksByHandle[id] = action;
      setImmediate(function () { runTask(id); });

      return id;
    };
  } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleMethod = function (action) {
      var id = nextHandle++;
      tasksByHandle[id] = action;
      process.nextTick(function () { runTask(id); });

      return id;
    };
  } else if (postMessageSupported()) {
    var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

    var onGlobalPostMessage = function (event) {
      // Only if we're a match to avoid any other global events
      if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
        runTask(event.data.substring(MSG_PREFIX.length));
      }
    };

    global.addEventListener('message', onGlobalPostMessage, false);

    scheduleMethod = function (action) {
      var id = nextHandle++;
      tasksByHandle[id] = action;
      global.postMessage(MSG_PREFIX + id, '*');
      return id;
    };
  } else if (!!global.MessageChannel) {
    var channel = new global.MessageChannel();

    channel.port1.onmessage = function (e) { runTask(e.data); };

    scheduleMethod = function (action) {
      var id = nextHandle++;
      tasksByHandle[id] = action;
      channel.port2.postMessage(id);
      return id;
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {

    scheduleMethod = function (action) {
      var scriptElement = global.document.createElement('script');
      var id = nextHandle++;
      tasksByHandle[id] = action;

      scriptElement.onreadystatechange = function () {
        runTask(id);
        scriptElement.onreadystatechange = null;
        scriptElement.parentNode.removeChild(scriptElement);
        scriptElement = null;
      };
      global.document.documentElement.appendChild(scriptElement);
      return id;
    };

  } else {
    scheduleMethod = function (action) {
      var id = nextHandle++;
      tasksByHandle[id] = action;
      global.setTimeout(function () {
        runTask(id);
      }, 0);

      return id;
    };
  }
}());

/**
* Gets a scheduler that schedules work via a timed callback based upon platform.
*/
function DefaultScheduler() {
  Scheduler.call(this);
}

inherits(DefaultScheduler, Scheduler);

function scheduleAction(disposable, action, scheduler, state) {
  return function schedule() {
    disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
  };
}

function ClearDisposable(method, id) {
  this._id = id;
  this._method = method;
  this.isDisposed = false;
}

ClearDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._method.call(null, this._id);
  }
};

DefaultScheduler.prototype.schedule = function (state, action) {
  var disposable = new SingleAssignmentDisposable(),
      id = scheduleMethod(scheduleAction(disposable, action, this, state));

  return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
};

DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  if (dueTime === 0) { return this.schedule(state, action); }

  var disposable = new SingleAssignmentDisposable(),
      id = global.setTimeout(scheduleAction(disposable, action, this, state), dueTime);

  return new BinaryDisposable(disposable, new ClearDisposable(global.clearTimeout, id));
};

function scheduleLongRunning(state, action, disposable) {
  return function () { action(state, disposable); };
}

DefaultScheduler.prototype.scheduleLongRunning = function (state, action) {
  var disposable = Disposable.create(noop);
  scheduleMethod(scheduleLongRunning(state, action, disposable));
  return disposable;
};

module.exports = DefaultScheduler;
