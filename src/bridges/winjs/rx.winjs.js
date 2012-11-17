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

(function (global) {
    // Aliases
    var root = global.Rx,
        Subject = root.Subject,
        AsyncSubject = root.AsyncSubject,
        Observer = root.Observer,
        observerCreate = Observer.create,
        Observable = root.Observable,
        observableProto = Observable.prototype,
        observableCreate = Observable.create,
        observableCreateWithDisposable = Observable.createWithDisposable,
        CompositeDisposable = root.CompositeDisposable,
        disposableCreate = root.Disposable.create,
        disposableEmpty = root.Disposable.empty,
        Promise = global.WinJS.Promise,
        Binding = global.WinJS.Binding;

    function customBind(thisP, fn) {
        return function () {
            return thisP[fn].apply(thisP, arguments);
        };
    }

    function createEventListener(el, eventName, handler) {
        var disposables = new CompositeDisposable();

        function createListener(element, en, fn) {
            element.addEventListener(en, fn, false);
            return disposableCreate(function () {
                element.removeEventListener(en, fn, false);
            });
        };

        // Assume collection versus single
        if (el && el.length) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        } else {
            disposables.add(createListener(el, eventName, handler));
        }

        return disposables;
    }

    Observable.fromEvent = function (element, eventName) {
        /// <summary>
        /// Binds an event to a given element or item.  This supports either a single object or a collection.
        /// </summary
        /// <param name="element">The element or object to bind the event to.</param>
        /// <param name="eventName">The name of the event to bind to the given element</param>
        /// <returns>An observable sequence which listens to the event on the given element or object</returns>
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, customBind(observer, 'onNext'));
        });
    };

    Promise.prototype.toObservable = function (observerOrOnNext) {
        /// <summary>
        /// Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
        /// </summary
        /// <param name="observerOrOnNext">[Optional] An optional Observer or onNext function to capture progress events.</param>
        /// <returns>An observable sequence wrapping an existing WinJS Promise object.</returns>
        var subject = new AsyncSubject();
        this.done(function (next) {
            subject.onNext(next);
            subject.onCompleted();
        }, customBind(subject, 'onError'), function (progress) {
            if (typeof observerOrOnNext === 'function') {
                observerOrOnNext(progress);
            } else if (observerOrOnNext) {
                observerOrOnNext.onNext(progress);
            }
        });
        return subject;
    };

    observableProto.toPromise = function () {
        /// <summary>
        /// Converts an existing Observable to a WinJS Promise object.
        /// </summary
        /// <returns>A WinJS Promise object which encapsulates the given Observable sequence.</returns>
        var parent = this, subscription, value;
        return new Promise(function (c, e) {
            subscription = parent.subscribe(function (v) {
                value = v;
            }, function (exn) {
                e(exn);
            }, function () {
                c(value);
            });
        }, function () {
            if (subscription) subscription.dispose();
        });
    };

    Promise.toObservable = function (promise, observerOrOnNext) {
        /// <summary>
        /// Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
        /// </summary
        /// <param name="promise">The Promise to convert to an Observable sequence.</param>
        /// <param name="observerOrOnNext">[Optional] An optional Observer or onNext function to capture progress events.</param>
        /// <returns>An observable sequence wrapping an existing WinJS Promise object.</returns>
        return Promise.prototype.toObservable.call(promise, observerOrOnNext);
    };

    var originalAs = Binding.as;

    function bindObservable(bindable, name) {
        return observableCreate(function (observer) {
            var handler = function (newValue, oldValue) {
                observer.onNext({
                    name: name,
                    newValue: newValue,
                    oldValue: oldValue,
                    dataObject: bindable
                });
            };
            bindable.bind(name, handler);
            return function () {
                bindable.unbind(name, handler);
            };
        });
    }

    Binding.as = function (data) {
        /// <summary>
        /// Returns an observable object. This may be an observable proxy for the specified object, an existing proxy, or
        /// the specified object itself if it directly supports observability.
        /// This also adds a .toObservable method which allows to turn the given binding object into an observable object.
        /// </summary>
        /// <param name="data">
        /// Object to provide observability for.
        /// </param>
        /// <returns>
        /// The observable object.
        /// </returns>
        var bindable = originalAs(data);
        bindable.toObservable = function () {
            if (arguments.length === 0) {
                throw new Error('Must have at least one binding');
            }
            var observables = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                observables.push(bindObservable(bindable, arguments[i]));
            }
            return Observable.merge(observables);
        };

        return bindable;
    };

    Subject.fromWebSocket = function (url, protocol, observerOrOnNext) {
        /// <summary>
        /// Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
        /// </summary
        /// <param name="url">The URL of the WebSocket.</param>
        /// <param name="protocol">The protocol of the WebSocket.</param>
        /// <param name="observerOrOnNext">[Optional] An optional Observer or onNext function to capture the open event.</param>
        /// <returns>An observable sequence wrapping a WebSocket.</returns>
        var socket = new WebSocket(url, protocol);

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

    Subject.fromWebWorker = function (url) {
        /// <summary>
        /// Creates a Web Worker with a given URL as a Subject
        /// </summary
        /// <param name="url">The URL of the Web Worker.</param>
        /// <returns>An observable sequence wrapping a Web Worker.</returns>
        var worker = new Worker(url);

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

    root.Observable.fromAccelerometer = function () {
        /// <summary>
        /// Creates a wrapper for the Accelerometer which listens for the readingchanged event.
        /// </summary
        /// <returns>An observable sequence wrapping the Accelerometer.</returns>
        return observableCreateWithDisposable(function (observer) {

            function handler(eventObject) {
                observer.onNext(eventObject);
            }

            var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
            if (!accelerometer) {
                observer.onError('The accelerometer is not supported on this device');
                return disposableEmpty;
            }

            accelerometer.addEventListener('readingchanged', handler, false);

            return disposableCreate(function () {
                accelerometer.removeEventListener('readingchanged', handler, false);
                accelerometer.reportInterval = 0;
            });
        });
    };

    root.Observable.fromGyrometer = function () {
        /// <summary>
        /// Creates a wrapper for the Gyrometer which listens for the readingchanged event.
        /// </summary
        /// <returns>An observable sequence wrapping the Gyrometer.</returns>
        return observableCreateWithDisposable(function (observer) {

            function handler(eventObject) {
                observer.onNext(eventObject);
            }

            var gyrometer = Windows.Devices.Sensors.Gyrometer.getDefault();
            if (!gyrometer) {
                observer.onError('The gyrometer is not supported on this device');
                return disposableEmpty;
            }

            gyrometer.addEventListener('readingchanged', handler, false);

            return disposableCreate(function () {
                gyrometer.removeEventListener('readingchanged', handler, false);
                gyrometer.reportInterval = 0;
            });
        });
    };

}(window));