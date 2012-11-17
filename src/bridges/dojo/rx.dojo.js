﻿/**
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
        define(['rx', 'exports', 'dojo'], function (Rx, exports, dojo) {
            root.Rx = factory(root, exports, Rx, dojo);
            return root.Rx;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('rx'), require('dojo'));
    } else {
        root.Rx = factory(root, {}, root.Rx, dojo);
    }
}(this, function (global, exp, root, dojo, undefined) {

    var Observable = root.Observable,
        AsyncSubject = root.AsyncSubject,
        observableCreate = Observable.create;

    Observable.fromDojoEvent = function (dojoObject, eventType, context, dontFix) {
        return observableCreate(function (observer) {
            var handler = function (eventObject) {
                observer.onNext(eventObject);
            },
            handle = dojo.connect(dojoObject, eventType, context, handler, dontFix);
            return function () {
                dojo.disconnect(handle);
            };
        });
    };
    
    dojo.xhrGetAsObservable = function (options) {
        var subject = new AsyncSubject();
        options.load = function (data) {
            subject.onNext(data);
            subject.onCompleted();
        };
        options.error = function (error) {
            subject.onError(error);
        };
        dojo.xhrGet(options);
        return subject;
    };
    
    dojo.xhrPostAsObservable = function (options) {
        var subject = new AsyncSubject();
        options.load = function (data) {
            subject.onNext(data);
            subject.onCompleted();
        };
        options.error = function (error) {
            subject.onError(error);
        };
        dojo.xhrPost(options);
        return subject;
    };

    dojo.xhrPutAsObservable = function (options) {
        subject = new AsyncSubject();
        options.load = function (data) {
            subject.onNext(data);
            subject.onCompleted();
        };
        options.error = function (error) {
            subject.onError(error);
        };
        dojo.xhrPut(options);
        return subject;
    };
    
    dojo.xhrDeleteAsObservable = function (options) {
        var subject = new asyncSubject();
        options.load = function (data) {
            subject.onNext(data);
            subject.onCompleted();
        };
        options.error = function (error) {
            subject.onError(error);
        };
        dojo.xhrDelete(options);
        return subject;
    };
    
    dojo.Deferred.prototype.asObservable = function () {
        var subject = new ayncSubject();
        this.then(function (value) {
            subject.onNext(value);
            subject.onCompleted();
        },
        function (error) {
            subject.onError(error);
        });
        return subject;
    };
    
    AsyncSubject.prototype.asDeferred = function () {
        var deferred = new dojo.Deferred();
        this.subscribe(function (value) {
            deferred.callback(value);
        }, function (error) {
            deferred.errback(error);
        });
        return deferred;
    };
    
    if (dojo.io && dojo.io.script) {
        dojo.io.script.getAsObservable = function (args) {
            var subject = new AsyncSubject();
            args.load = function (data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            args.error = function (error) {
                subject.onError(error);
            };
            dojo.io.script.get(args);
            return subject;
        };
    }

    return root;
}));