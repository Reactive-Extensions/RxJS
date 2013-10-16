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
}(this, function (global, exp, Rx, undefined) {
    
    // Aliases
    var Observable = Rx.Observable,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        disposableCreate = Rx.Disposable.create,
        CompositeDisposable= Rx.CompositeDisposable,
        AsyncSubject = Rx.AsyncSubject;

    function fixEvent(event) {
        var stopPropagation = function () {
            this.cancelBubble = true;
        };

        var preventDefault = function () {
            this.bubbledKeyCode = this.keyCode;
            if (this.ctrlKey) {
                try {
                    this.keyCode = 0;
                } catch (e) { }
            }
            this.defaultPrevented = true;
            this.returnValue = false;
            this.modified = true;
        };

        event || (event = window.event);
        if (!event.target) {
            event.target = event.target || event.srcElement; 

            if (event.type == 'mouseover') {
                event.relatedTarget = event.fromElement;
            }
            if (event.type == 'mouseout') {
                event.relatedTarget = event.toElement;
            }
            // Adding stopPropogation and preventDefault to IE
            if (!event.stopPropagation){
                event.stopPropagation = stopPropagation;
                event.preventDefault = preventDefault;
            }
            // Normalize key events
            switch(event.type){
                case 'keypress':
                    var c = ('charCode' in event ? event.charCode : event.keyCode);
                    if (c == 10) {
                        c = 0;
                        event.keyCode = 13;
                    } else if (c == 13 || c == 27) {
                        c = 0; 
                    } else if (c == 3) {
                        c = 99; 
                    }
                    event.charCode = c;
                    event.keyChar = event.charCode ? String.fromCharCode(event.charCode) : '';
                    break;
            }                    
        }

        return event;
    }

    function createListener (element, name, handler) {
        // Node.js specific
        if (element.addListener) {
            element.addListener(name, handler);
            return disposableCreate(function () {
                element.removeListener(name, handler);
            });
        }
        // Standards compliant
        if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
            });
        } else if (element.attachEvent) {
            // IE Specific
            var innerHandler = function (event) {
                handler(fixEvent(event));
            };
            element.attachEvent('on' + name, innerHandler);
            return disposableCreate(function () {
                element.detachEvent('on' + name, innerHandler);
            });         
        } else {
            // Level 1 DOM Events      
            element['on' + name] = handler;
            return disposableCreate(function () {
                element['on' + name] = null;
            });
        }
    }

    function createEventListener (el, eventName, handler) {
        var disposables = new CompositeDisposable();

        // Asume NodeList
        if (el && el.length) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        } else if (el) {
            disposables.add(createListener(el, eventName, handler));
        }

        return disposables;
    }

    /**
     * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
     *
     * @example
     *   var source = Rx.Observable.fromEvent(element, 'mouseup');
     * 
     * @param {Object} element The DOMElement or NodeList to attach a listener.
     * @param {String} eventName The event name to attach the observable sequence.
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    Observable.fromEvent = function (element, eventName) {
        return new AnonymousObservable(function (observer) {
            return createEventListener(element, eventName, function handler (e) { observer.onNext(e); });
        }).publish().refCount();
    };
    /**
     * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
     * @param {Function} addHandler The function to add a handler to the emitter.
     * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
     * @returns {Observable} An observable sequence which wraps an event from an event emitter
     */
    Observable.fromEventPattern = function (addHandler, removeHandler) {
        return new AnonymousObservable(function (observer) {
            function innerHandler (e) {
                observer.onNext(e);
            }

            var returnValue = addHandler(innerHandler);
            return disposableCreate(function () {
                if (removeHandler) {
                    removeHandler(innerHandler, returnValue);
                }
            });
        }).publish().refCount();
    };

    /**
     * Converts a Promise to an Observable sequence
     * @param {Promise} A Promises A+ implementation instance.
     * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
     */
    Observable.fromPromise = function (promise) {
        var subject = new AsyncSubject();
        
        promise.then(
            function (value) {
                subject.onNext(value);
                subject.onCompleted();
            }, 
            function (reason) {
               subject.onError(reason);
            });
            
        return subject.asObservable();
    };
    return Rx;
}));