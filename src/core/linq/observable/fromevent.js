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