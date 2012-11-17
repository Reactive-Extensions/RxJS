/**
* Copyright 2011 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports &&
    (typeof root == 'object' && root && root == root.global && (window = root), exports);

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    }  else if (typeof module == 'object' && module && module.exports == freeExports) {
        var rxroot = factory(root, module.exports, require('rx'));
        module.exports = rxroot.Rx;
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}(this, function (global, undefined) {
    var freeExports = typeof exports == 'object' && exports &&
        (typeof global == 'object' && global && global == global.global && (window = global), exports);

    var root = global.Rx,
        Observable = root.Observable,
        observableProto = Observable.prototype,
        observableCreateWithDisposable = Observable.createWithDisposable,
        disposableCreate = root.Disposable.create,
        CompositeDisposable = root.CompositeDisposable,
        RefCountDisposable = root.RefCountDisposable,
        AsyncSubject = root.AsyncSubject;

    var createEventListener = function (el, eventName, handler) {
        var disposables = new CompositeDisposable(),

            createListener = function (element, eventName, handler) {
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                    return disposableCreate(function () {
                        element.removeEventListener(eventName, handler, false);
                    });
                } else if (element.attachEvent) {
                    element.attachEvent('on' + eventName, handler);
                    return disposableCreate(function () {
                        element.detachEvent('on' + eventName, handler);
                    });         
                } else {
                    element['on' + eventName] = handler;
                    return disposableCreate(function () {
                        element['on' + eventName] = null;
                    });
                }
            };

        if ( el && el.nodeName || el === global ) {
            disposables.add(createListener(el, eventName, handler));
        } else if ( el && el.length ) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        }

        return disposables;
    };

    Observable.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            var handler = function (e) {
                observer.onNext(e); 
            };
            return createEventListener(element, eventName, handler);
        });
    };

    var destroy = (function () {
        var trash = document.createElement('div');
        return function (element) {
            trash.appendChild(element);
            trash.innerHTML = '';
        };
    })();


    Observable.getJSONPRequest = (function () {
        var uniqueId = 0;
        return function (url) {
            var subject = new AsyncSubject(),
                head = document.getElementsByTagName('head')[0] || document.documentElement,
                tag = document.createElement('script'),
                handler = 'rxjscallback' + uniqueId++,
                url = url.replace('=JSONPCallback', '=' + handler);

            global[handler] = function (data) {
                subject.onNext(data);
                subject.onCompleted();  
            };

            tag.src = url;
            tag.async = true;
            tag.onload = tag.onreadystatechange = function (_, abort) {
                if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
                    tag.onload = tag.onreadystatechange = null;
                    if (head && tag.parentNode) {
                        destroy(tag);
                    }
                    tag = undefined;
                    delete global[handler];
                }

            };  
            head.insertBefore(tag, head.firstChild );
            var refCount = new RefCountDisposable(disposableCreate( function () {
                if (!/loaded|complete/.test(tag.readyState)) {
                    tag.abort();
                    tag.onload = tag.onreadystatechange = null;
                    if (head && tag.parentNode) {
                        destroy(tag);
                    }
                    tag = undefined;
                    delete global[handler];
                    subject.onError(new Error('The script has been aborted'));
                }
            }));

            return observableCreateWithDisposable( function (subscriber) {
                return new CompositeDisposable(subject.subscribe(subscriber), refCount.getDisposable());
            });
        };      

    })();



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

    var observableAjax = Observable.ajax = function (settings) {
        if (typeof settings === 'string') {
            settings = { method: 'GET', url: settings, async: true };
        }
        if (settings.async === undefined) {
            settings.async = true;
        }
        var subject = new AsyncSubject(),
            xhr = getXMLHttpRequest();

        if (settings.headers) {
            var headers = settings.headers, header;
            for (header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }                   
        try {
            if (details.user) {
                xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
            } else {
                xhr.open(settings.method, settings.url, settings.async);
            }
            xhr.onreadystatechange = xhr.onload = function () {
                if (xhr.readyState === 4) {
                    var status = xhr.status;
                    if ((status >= 200 && status <= 300) || status === 0 || status === '') {
                        subject.onNext(xhr);
                        subject.onCompleted();
                    } else {
                        subject.onError(xhr);
                    }
                }
            };
            xhr.onerror = xhr.onabort = function () {
                subject.onError(xhr);
            };
            xhr.send(settings.body || null);
        } catch (e) {
            subject.onError(e);
        }

        var refCount = new RefCountDisposable(disposableCreate( function () {
            if (xhr.readyState !== 4) {
                xhr.abort();
                subject.onError(xhr);
            }
        }));

        return observableCreateWithDisposable( function (subscriber) {
            return new CompositeDisposable(subject.subscribe(subscriber), refCount.getDisposable());
        });
    };

    Observable.post = function (url, body) {
        return observableAjax({ url: url, body: body, method: 'POST', async: true });
    };

    var observableGet = Observable.get = function (url) {
        return observableAjax({ url: url, method: 'GET', async: true });
    };

    if (JSON && JSON.parse) {
        Observable.getJSON = function (url) {
            return observableGet(url).select(function (xhr) {
                return JSON.parse(xhr.responseText);
            });
        };      
    }

    return root;

}));