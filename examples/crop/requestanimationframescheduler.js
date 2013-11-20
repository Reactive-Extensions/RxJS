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
        CompositeDisposable = Rx.CompositeDisposable,
        disposableCreate = Rx.Disposable.create,
        defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }());;

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

        function scheduleNow(state, action) {
            var scheduler = this,
                disposable = new SingleAssignmentDisposable();
            var id = requestAnimFrame(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this,
                dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }

            var disposable = new SingleAssignmentDisposable(),
                id;
            var scheduleFunc = function () {
                if (id) { cancelAnimFrame(id); }
                if (dt - scheduler.now() <= 0) {
                    if (!disposable.isDisposed) {
                        disposable.setDisposable(action(scheduler, state));
                    }
                } else {
                    id = requestAnimFrame(scheduleFunc);
                }
            };

            id = requestAnimFrame(scheduleFunc);

            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);        

    }());

    return Rx;
}));
    