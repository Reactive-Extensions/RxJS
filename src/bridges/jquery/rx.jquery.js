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
        define(['rx', 'exports', 'jquery'], function (Rx, exports, jQuery) {
            root.Rx = factory(root, exports, Rx, jQuery);
            return root.Rx;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('rx'), require('jquery'));
    } else {
        root.Rx = factory(root, {}, root.Rx, jQuery);
    }
}(this, function (global, exp, root, $, undefined) {

    var observable = root.Observable,
        observableProto = observable.prototype,
        asyncSubject = root.AsyncSubject,
        observableCreate = observable.create,
        observableCreateWithDisposable = observable.createWithDisposable,
        disposableEmpty = root.Disposable.empty,
        slice = Array.prototype.slice,
        proto = $.fn;

    $.Deferred.prototype.toObservable = function () {
        var subject = new asyncSubject();
        this.done(function () {
            subject.onNext(slice.call(arguments));
            subject.onCompleted();
        }).fail(function () {
            subject.onError(slice.call(arguments));
        });
        return subject;
    };

    observableProto.toDeferred = function () {
        var deferred = $.Deferred();
        this.subscribe(function (value) {
            deferred.resolve(value);
        }, function (e) { 
            deferred.reject(e);
        });
        return deferred;  
    };

    //in order to support jQuery 1.6.*
    if ($.Callbacks) {
        $.Callbacks.prototype.toObservable = function () {
                var parent = this;
                return observableCreate(function (observer) {
                    var handler = function(values) {
                        observer.onNext(values);
                    };
                    parent.add(handler);
                    return function () {
                        parent.remove(handler);
                    };
                });
            };
    }

    proto.onAsObservable = function (events, selector, data) {
        var parent = this;
        return observableCreate(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            parent.on(events, selector, data, handler);
            return function() {
                parent.off(events, selector, handler);
            };
        });          
    };

    proto.bindAsObservable = function(eventType, eventData) {
        var parent = this;
        return observableCreate(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            parent.bind(eventType, eventData, handler);
            return function() {
                parent.unbind(eventType, handler);
            };
        });
    };
    proto.delegateAsObservable = function(selector, eventType, eventData) {
        var parent = this;
        return observableCreate(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            parent.delegate(selector, eventType, eventData, handler);
            return function() {
                parent.undelegate(selector, eventType, handler);
            };
        });
    };
    proto.liveAsObservable = function(eventType, eventData) {
        var parent = this;
        return observableCreate(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            parent.live(eventType, eventData, handler);
            return function() {
                parent.die(eventType, handler);
            };
        });
    };
    proto.changeAsObservable = function (eventData) {
        return this.bindAsObservable('change', eventData);
    };
    proto.clickAsObservable = function (eventData) {
        return this.bindAsObservable('click', eventData);
    };
    proto.dblclickAsObservable = function (eventData) {
        return this.bindAsObservable('dblclick', eventData);
    };    
    proto.focusAsObservable = function(eventData) {
        return this.bindAsObservable('focus', eventData);
    };
    proto.focusinAsObservable = function(eventData) {
        return this.bindAsObservable('focusin', eventData);
    };
    proto.focusoutAsObservable = function(eventData) {
        return this.bindAsObservable('focusout', eventData);
    };
    proto.keydownAsObservable = function(eventData) {
        return this.bindAsObservable('keydown', eventData);
    };
    proto.keyupAsObservable = function(eventData) {
        return this.bindAsObservable('keyup', eventData);
    };
    proto.loadAsObservable = function(eventData) {
        return this.bindAsObservable('load', eventData);
    };
    proto.mousedownAsObservable = function(eventData) {
        return this.bindAsObservable('mousedown', eventData);
    };
    proto.mouseenterAsObservable = function(eventData) {
        return this.bindAsObservable('mouseenter', eventData);
    };
    proto.mouseleaveAsObservable = function(eventData) {
        return this.bindAsObservable('mouseleave', eventData);
    };
    proto.mousemoveAsObservable = function(eventData) {
        return this.bindAsObservable('mousemove', eventData);
    };
    proto.mouseoutAsObservable = function(eventData) {
        return this.bindAsObservable('mouseout', eventData);  
    };
    proto.mouseoverAsObservable = function(eventData) {
        return this.bindAsObservable('mouseover', eventData);
    };
    proto.mouseupAsObservable = function(eventData) {
        return this.bindAsObservable('mouseup', eventData);
    };
    proto.resizeAsObservable = function(eventData) {
        return this.bindAsObservable('resize', eventData);
    };
    proto.scrollAsObservable = function(eventData) {
        return this.bindAsObservable('scroll', eventData);
    };
    proto.selectAsObservable = function(eventData) {
        return this.bindAsObservable('select', eventData);
    };
    proto.submitAsObservable = function(eventData) {
        return this.bindAsObservable('submit', eventData);
    };
    proto.unloadAsObservable = function(eventData) {
        return this.bindAsObservable('unload', eventData);
    };
    proto.oneAsObservable = function(types, selector, data) {
        var parent = this;
        return observableCreateWithDisposable(function(observer) {
            var handler = function(eventObject) {
                parent.off(types, selector, data, handler);
                observer.onNext(eventObject);
                observer.onCompleted();         
            };
            parent.on(types, selector, data, handler);
            return dispoableEmpty;
        });
    };
    proto.readyAsObservable = function() {
        var parent = this;
        return observableCreateWithDisposable(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            parent.ready(handler);
            return dispoableEmpty;
        });
    };
    proto.hideAsObservable = function(duration) {
        var subject = new asyncSubject();
        this.hide(duration, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.showAsObservable = function(duration, easing) {
        var subject = new asyncSubject();
        this.show(duration, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.animateAsObservable = function(properties, duration, easing) {
        var subject = new asyncSubject();
        this.animate(properties, duration, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.fadeInAsObservable = function(duration, easing) {
        var subject = new asyncSubject();
        this.fadeIn(duration, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.fadeToAsObservable = function(duration, opacity, easing) {
        var subject = new asyncSubject();
        this.fadeTo(duration, opacity, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.fadeOutAsObservable = function(duration, easing) {
        var subject = new asyncSubject();
        this.fadeOut(duration, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.fadeToggleAsObservable = function(duration, easing) {
        var subject = new asyncSubject();
        this.fadeToggle(duration, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.slideDownAsObservable = function(duration) {
        var subject = new asyncSubject();
        this.slideDown(duration, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.slideUpAsObservable = function(duration) {
        var subject = new asyncSubject();
        this.slideUp(duration, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.slideToggleAsObservable = function(duration) {
        var subject = new asyncSubject();
        this.slideToggle(duration, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };
    proto.toggleAsObservable = function(duration, easing) {
        var subject = new asyncSubject();
        this.toggle(duration, easing, function() {
            subject.onNext(this);
            subject.onCompleted();
        });
        return subject;
    };    
    var ajaxAsObservable = $.ajaxAsObservable = function(settings) {      
        var subject = new asyncSubject(), internalSettings = {};
        internalSettings.success = function(data, textStatus, jqXHR) {
            subject.onNext({ data: data, textStatus: textStatus, jqXHR: jqXHR });
            subject.onCompleted();
        };
        internalSettings.error = function(jqXHR, textStatus, errorThrown) {
            subject.onError({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
        };
        $.extend(true, internalSettings, settings);
        $.ajax(internalSettings);
        return subject;
    };
    $.getAsObservable = function(url, data, dataType) {
        return ajaxAsObservable({ url: url, dataType: dataType, data: data });
    };
    $.getJSONAsObservable = function(url, data) {
        return ajaxAsObservable({ url: url, dataType: 'json', data: data });
    };
    $.getScriptAsObservable = function(url) {
        return ajaxAsObservable({ url: url, dataType: 'script'});
    };
    $.postAsObservable = function(url, data, dataType) {
        return ajaxAsObservable({ url: url, dataType: dataType, data: data, type: 'POST'}); 
    };

    return root;
}));