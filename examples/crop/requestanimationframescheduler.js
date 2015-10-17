// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (root, factory) {
  var freeExports = typeof exports == 'object' && exports,
    freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
    freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    window = freeGlobal;
  }

  // Because of build optimizers
  if (typeof define === 'function' && define.amd) {
    define(['rx', 'exports'], function (Rx, exports) {
      root.Rx = factory(root, exports, Rx);
      return root.Rx;
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('./rx'));
  } else {
    root.Rx = factory(root, {}, root.Rx);
  }
}(this, function (window, exp, Rx, undefined) {

  var Scheduler = Rx.Scheduler,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    BinaryDisposable = Rx.BinaryDisposable,
    Disposable = Rx.Disposable,
    inherits = Rx.internals.inherits;

  // Get the right animation frame method
  var requestAnimFrame, cancelAnimFrame;
  if (window.requestAnimationFrame) {
    requestAnimFrame = window.requestAnimationFrame;
    cancelAnimFrame = window.cancelAnimationFrame;
  } else if (window.mozRequestAnimationFrame) {
    requestAnimFrame = window.mozRequestAnimationFrame;
    cancelAnimFrame = window.mozCancelAnimationFrame;
  } else if (window.webkitRequestAnimationFrame) {
    requestAnimFrame = window.webkitRequestAnimationFrame;
    cancelAnimFrame = window.webkitCancelAnimationFrame;
  } else if (window.msRequestAnimationFrame) {
    requestAnimFrame = window.msRequestAnimationFrame;
    cancelAnimFrame = window.msCancelAnimationFrame;
  } else if (window.oRequestAnimationFrame) {
    requestAnimFrame = window.oRequestAnimationFrame;
    cancelAnimFrame = window.oCancelAnimationFrame;
  } else {
    requestAnimFrame = function(cb) { window.setTimeout(cb, 1000 / 60); };
    cancelAnimFrame = window.clearTimeout;
  }

  /**
   * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
   */
  Scheduler.requestAnimationFrame = (function () {
    var RequestAnimationFrameScheduler = (function (__super__) {
      inherits(RequestAnimationFrameScheduler, __super__);
      function RequestAnimationFrameScheduler() {
        __super__.call(this);
      }

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

      RequestAnimationFrameScheduler.prototype.schedule = function (state, action) {
        var disposable = new SingleAssignmentDisposable(),
            id = requestAnimFrame(scheduleAction(disposable, action, this, state));
        return new BinaryDisposable(disposable, new ClearDisposable(cancelAnimFrame, id));
      };

      RequestAnimationFrameScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
        if (dueTime === 0) { return this.schedule(state, action); }
        var disposable = new SingleAssignmentDisposable(),
            id = root.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
        return new BinaryDisposable(disposable, new ClearDisposable(root.clearTimeout, id));
      };

      return RequestAnimationFrameScheduler;
    }(Scheduler));

    return new RequestAnimationFrameScheduler();
  }());

  return Rx;
}));
