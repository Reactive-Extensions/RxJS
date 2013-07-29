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
    
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }    

    var Rx = window.Rx,
        Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreate = Observable.create,
        observableCreateWithDisposable = Observable.createWithDisposable,
        disposableCreate = Rx.Disposable.create,
        CompositeDisposable = Rx.CompositeDisposable,
        Subject = Rx.Subject,
        Scheduler = Rx.Scheduler,
        dom = Rx.DOM = {},
        ajax = Rx.DOM.Request = {};

    /** @private
     * Creates an event listener on a single element with compat back to DOM Level 1.
     */
    function createListener (element, name, handler) {
        // Standards compliant
        if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
            });
        } else if (element.attachEvent) {
            // IE Specific
            var innerHandler = function (event) {
                event || (event = window.event);
                event.target = event.target || event.srcElement; 
                handler(event);  
            };
            element.attachEvent('on' + name, innerHandler);
            return disposableCreate(function () {
                element.detachEvent('on' + name, innerHandler);
            });         
        } else {
            // Level 1 DOM Events
            var innerHandler = function (event) {
                event || (event = window.event);
                event.target = event.target || event.srcElement; 
                handler(event);  
            };            
            element['on' + name] = innerHandler;
            return disposableCreate(function () {
                element['on' + name] = null;
            });
        }
    }

    /** @private
     * Creates event listeners on either a single element or NodeList
     */
    function createEventListener (el, eventName, handler) {
        var disposables = new CompositeDisposable();

        if ( el && el.nodeName || el === window ) {
            disposables.add(createListener(el, eventName, handler));
        } else if ( el && el.length ) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        }

        return disposables;
    }

    /**
     * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
     *
     * @example
     *   source = Rx.DOM.fromEvent(element, 'mouseup');
     * 
     * @param {Object} element The DOMElement or NodeList to attach a listener.
     * @param {String} eventName The event name to attach the observable sequence.
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    dom.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, function handler (e) { observer.onNext(e); });
        });
    };

    /* @private 
     * Gets the proper XMLHttpRequest for support for older IE 
     */
    function getXMLHttpRequest() {
        if (global.XMLHttpRequest) {
            return new global.XMLHttpRequest;
        } else {
            try {
                return new global.ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {
                throw new Error('XMLHttpRequest is not supported by your browser');
            }
        }
    }

    /**
     * Creates a cold observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
     *
     * @example 
     *   source = Rx.DOM.Request.ajaxCold('/products');
     *   source = Rx.DOM.Request.ajaxCold( url: 'products', method: 'GET' });
     *     
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the Ajax call.
     *  An object with the following properties
     *   - url: URL of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *
     * @returns {Observable} An observable sequence containing the XMLHttpRequest.
    */
    ajax.ajaxCold = function (settings) {
        return observableCreateWithDisposable( function (observer) {
            if (typeof settings === 'string') {
                settings = { method: 'GET', url: settings, async: true };
            }
            if (settings.async === undefined) {
                settings.async = true;
            }

            var xhr;
            try {
                xhr = getXMLHttpRequest();
            } catch (err) {
                observer.onError(err);
            }

            try {
                if (settings.user) {
                    xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
                } else {
                    xhr.open(settings.method, settings.url, settings.async);
                }

                if (settings.headers) {
                    var headers = settings.headers;
                    for (var header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            xhr.setRequestHeader(header, headers[header]);
                        }
                    }
                }

                xhr.onreadystatechange = xhr.onload = function () {
                    if (xhr.readyState === 4) {
                        var status = xhr.status;
                        if ((status >= 200 && status <= 300) || status === 0 || status === '') {
                            observer.onNext(xhr);
                            observer.onCompleted();
                        } else {
                            observer.onError(xhr);
                        }
                    }
                };

                xhr.onerror = function () {
                    observer.onError(xhr);
                };

                xhr.send(settings.body || null);
            } catch (e) {
                observer.onError(e);
            }
        
            return disposableCreate( function () {
                if (xhr.readyState !== 4) {
                    xhr.abort();
                }
            });
        });
    };

    /** @private */
    var ajaxCold = ajax.ajaxCold;

    /**
     * Creates a hot observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
     *
     * @example 
     *   source = Rx.DOM.Request.ajax('/products');
     *   source = Rx.DOM.Request.ajax( url: 'products', method: 'GET' });
     *
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the Ajax call.
     *  An object with the following properties
     *   - url: URL of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *
     * @returns {Observable} An observable sequence containing the XMLHttpRequest.
    */
    var observableAjax = ajax.ajax = function (settings) {
        return ajaxCold(settings).publishLast().refCount();
    };

    /**
     * Creates an observable sequence from an Ajax POST Request with the body.
     *
     * @param {String} url The URL to POST
     * @param {Object} body The body to POST
     * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
     */
    ajax.post = function (url, body) {
        return observableAjax({ url: url, body: body, method: 'POST', async: true });
    };
    
    /**
     * Creates an observable sequence from an Ajax GET Request with the body.
     *
     * @param {String} url The URL to GET
     * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
     */   
    var observableGet = ajax.get = function (url) {
        return observableAjax({ url: url, method: 'GET', async: true });
    };
    
    if (JSON && typeof JSON.parse === 'function') {
        /**
         * Creates an observable sequence from JSON from an Ajax request
         *
         * @param {String} url The URL to GET
         * @returns {Observable} The observable sequence which contains the parsed JSON.
         */       
        ajax.getJSON = function (url) {
            return observableGet(url).select(function (xhr) {
                return JSON.parse(xhr.responseText);
            });
        };      
    }    

    /** @private
     * Destroys the current element
     */
    var destroy = (function () {
        var trash = document.createElement('div');
        return function (element) {
            trash.appendChild(element);
            trash.innerHTML = '';
        };
    })();

    /**
     * Creates a cold observable JSONP Request with the specified settings.
     *
     * @example 
     *   source = Rx.DOM.Request.jsonpRequestCold('http://www.bing.com/?q=foo&JSONPRequest=?');
     *   source = Rx.DOM.Request.jsonpRequestCold( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
     *
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
     *  An object with the following properties
     *   - url: URL of the request
     *   - jsonp: The named callback parameter for the JSONP call
     *
     * @returns {Observable} A cold observable containing the results from the JSONP call.
     */
    ajax.jsonpRequestCold = (function () {
        var uniqueId = 0;
        return function (settings) {
            return Observable.createWithDisposable(function (observer) {

                if (typeof settings === 'string') {
                    settings = { url: settings }
                }
                if (!settings.jsonp) {
                    settings.jsonp = 'JSONPCallback';
                }

                var head = document.getElementsByTagName('head')[0] || document.documentElement,
                    tag = document.createElement('script'),
                    handler = 'rxjscallback' + uniqueId++;

                settings.url = settings.url.replace('=' + settings.jsonp, '=' + handler);

                window[handler] = function (data) {
                    observer.onNext(data);
                    observer.onCompleted();  
                };

                tag.src = settings.url;
                tag.async = true;
                tag.onload = tag.onreadystatechange = function (_, abort) {
                    if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
                        tag.onload = tag.onreadystatechange = null;
                        if (head && tag.parentNode) {
                            destroy(tag);
                        }
                        tag = undefined;
                        window[handler] = undefined;
                    }
                    
                };  
                head.insertBefore(tag, head.firstChild);

                return disposableCreate(function () {
                    if (!tag) {
                        return;
                    }
                    tag.onload = tag.onreadystatechange = null;
                    if (head && tag.parentNode) {
                        destroy(tag);
                    }
                    tag = undefined;
                    window[handler] = undefined;
                });
            });
        };      

    })();

    /** @private */
    var getJSONPRequestCold = ajax.jsonpRequestCold;

    /**
     * Creates a hot observable JSONP Request with the specified settings.
     *
     * @example 
     *   source = Rx.DOM.Request.getJSONPRequest('http://www.bing.com/?q=foo&JSONPRequest=?');
     *   source = Rx.DOM.Request.getJSONPRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
     * 
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
     *  An object with the following properties
     *   - url: URL of the request
     *   - jsonp: The named callback parameter for the JSONP call
     *
     * @returns {Observable} A hot observable containing the results from the JSONP call.
     */
    ajax.jsonpRequest = function (settings) {
        return getJSONPRequestCold(settings).publishLast().refCount();
    };
    if (window.WebSocket) {
         /**
         * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
         * 
         * @example
         *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', function(e) { ... });
         *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', observer);
         *s
         * @param {String} url The URL of the WebSocket.
         * @param {String} protocol The protocol of the WebSocket.
         * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture the open event.
         * @returns {Subject} An observable sequence wrapping a WebSocket.
         */
        dom.fromWebSocket = function (url, protocol, observerOrOnNext) {
            var socket = new window.WebSocket(url, protocol);

            var observable = observableCreate(function (obs) {
                if (observerOrOnNext) {
                    socket.onopen = function (openEvent) {
                        if (typeof observerOrOnNext === 'function') {
                            observerOrOnNext(openEvent);
                        } else if (observerOrOnNext.onNext) {
                            observerOrOnNext.onNext(openEvent);
                        }
                    };
                }

                socket.onmessage = function (data) {
                    obs.onNext(data);
                };

                socket.onerror = function (err) {
                    obs.onError(err);
                };

                socket.onclose = function () {
                    obs.onCompleted();
                };

                return function () {
                    socket.close();
                };
            });

            var observer = observerCreate(function (data) {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(data);
                }
            });

            return Subject.create(observer, observable);
        };       
    }


    if (window.Worker) {
        /**
         * Creates a Web Worker with a given URL as a Subject.
         * 
         * @example
         * var worker = Rx.DOM.fromWebWorker('worker.js');
         *
         * @param {String} url The URL of the Web Worker.
         * @returns {Subject} A Subject wrapping the Web Worker.
         */
        dom.fromWebWorker = function (url) {
            var worker = new window.Worker(url);

            var observable = observableCreateWithDisposable(function (obs) {
                worker.onmessage = function (data) {
                    obs.onNext(data);
                };

                worker.onerror = function (err) {
                    obs.onError(err);
                };

                return disposableCreate(function () {
                    worker.close();
                });
            });

            var observer = observerCreate(function (data) {
                worker.postMessage(data);
            });

            return Subject.create(observer, observable);
        };      
    }

    if (window.MutationObserver) {

        /**
         * Creates an observable sequence from a Mutation Observer.
         * MutationObserver provides developers a way to react to changes in a DOM.
         * @example
         *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
         *
         * @param {Object} target The Node on which to obserave DOM mutations.
         * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
         * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
         */
        dom.fromMutationObserver = function (target, options) {

            return observableCreate(function (observer) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    observer.onNext(mutations);
                });

                mutationObserver.observe(target, options);

                return function () {
                    mutationObserver.disconnect();
                };
            });

        };

    }
    return Rx;
}));