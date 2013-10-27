    function createListener (element, name, handler) {
        // Node.js specific
        if (element.addListener) {
            element.addListener(name, handler);
            return disposableCreate(function () {
                element.removeListener(name, handler);
            });
        } else if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
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
     * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.     
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    Observable.fromEvent = function (element, eventName, selector) {
        return new AnonymousObservable(function (observer) {
            return createEventListener(
                element, 
                eventName, 
                function handler (e) { 
                    var results = e;

                    if (selector) {
                        try {
                            results = selector(arguments);
                        } catch (err) {
                            observer.onError(err);
                            return
                        }
                    }

                    observer.onNext(results); 
                });
        }).publish().refCount();
    };