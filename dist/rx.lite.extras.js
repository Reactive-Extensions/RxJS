// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (factory) {
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };

    var root = (objectTypes[typeof window] && window) || this,
        freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
        freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
        moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
        freeGlobal = objectTypes[typeof global] && global;
    
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
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
}.call(this, function (root, exp, Rx, undefined) {
    
  // References
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    observableNever = Observable.never,
    observableThrow = Observable.throwException,
    AnonymousObservable = Rx.AnonymousObservable,
    Observer = Rx.Observer,
    Subject = Rx.Subject,
    internals = Rx.internals,
    helpers = Rx.helpers,
    ScheduledObserver = internals.ScheduledObserver,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    CompositeDisposable = Rx.CompositeDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    disposableEmpty = Rx.Disposable.empty,
    immediateScheduler = Rx.Scheduler.immediate,
    defaultKeySerializer = helpers.defaultKeySerializer,
    addRef = Rx.internals.addRef,
    identity = helpers.identity,
    isPromise = helpers.isPromise,
    inherits = internals.inherits,
    noop = helpers.noop,
    observableFromPromise = Observable.fromPromise,   
    slice = Array.prototype.slice;

  function argsOrArray(args, idx) {
    return args.length === 1 && Array.isArray(args[idx]) ?
      args[idx] :
      slice.call(args);
  }

  var argumentOutOfRange = 'Argument out of range';

    function ScheduledDisposable(scheduler, disposable) {
        this.scheduler = scheduler;
        this.disposable = disposable;
        this.isDisposed = false;
    }

    ScheduledDisposable.prototype.dispose = function () {
        var parent = this;
        this.scheduler.schedule(function () {
            if (!parent.isDisposed) {
                parent.isDisposed = true;
                parent.disposable.dispose();
            }
        });
    };

    var CheckedObserver = (function (_super) {
        inherits(CheckedObserver, _super);

        function CheckedObserver(observer) {
            _super.call(this);
            this._observer = observer;
            this._state = 0; // 0 - idle, 1 - busy, 2 - done
        }

        var CheckedObserverPrototype = CheckedObserver.prototype;

        CheckedObserverPrototype.onNext = function (value) {
            this.checkAccess();
            try {
                this._observer.onNext(value);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 0;
            }
        };

        CheckedObserverPrototype.onError = function (err) {
            this.checkAccess();
            try {
                this._observer.onError(err);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserverPrototype.onCompleted = function () {
            this.checkAccess();
            try {
                this._observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserverPrototype.checkAccess = function () {
            if (this._state === 1) { throw new Error('Re-entrancy detected'); }
            if (this._state === 2) { throw new Error('Observer completed'); }
            if (this._state === 0) { this._state = 1; }
        };

        return CheckedObserver;
    }(Observer));

    /** @private */
    var ObserveOnObserver = (function (_super) {
        inherits(ObserveOnObserver, _super);

        /** @private */ 
        function ObserveOnObserver() {
            _super.apply(this, arguments);
        }

        /** @private */ 
        ObserveOnObserver.prototype.next = function (value) {
            _super.prototype.next.call(this, value);
            this.ensureActive();
        };

        /** @private */ 
        ObserveOnObserver.prototype.error = function (e) {
            _super.prototype.error.call(this, e);
            this.ensureActive();
        };

        /** @private */ 
        ObserveOnObserver.prototype.completed = function () {
            _super.prototype.completed.call(this);
            this.ensureActive();
        };

        return ObserveOnObserver;
    })(ScheduledObserver);

     /**
     *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
     * 
     *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
     *  that require to be run on a scheduler, use subscribeOn.
     *          
     *  @param {Scheduler} scheduler Scheduler to notify observers on.
     *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.     
     */
    observableProto.observeOn = function (scheduler) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer));
        });
    };

     /**
     *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
     *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

     *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
     *  callbacks on a scheduler, use observeOn.

     *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
     *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
     */
    observableProto.subscribeOn = function (scheduler) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
            d.setDisposable(m);
            m.setDisposable(scheduler.schedule(function () {
                d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)));
            }));
            return d;
        });
    };

  /**
   *  Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
   *  
   * @example
   *  var res = Rx.Observable.using(function () { return new AsyncSubject(); }, function (s) { return s; });
   * @param {Function} resourceFactory Factory function to obtain a resource object.
   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
   */
  Observable.using = function (resourceFactory, observableFactory) {
    return new AnonymousObservable(function (observer) {
      var disposable = disposableEmpty, resource, source;
      try {
        resource = resourceFactory();
        if (resource) {
          disposable = resource;
        }
        source = observableFactory(resource);
      } catch (exception) {
        return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable);
      }
      return new CompositeDisposable(source.subscribe(observer), disposable);
    });
  };

  /**
   * Propagates the observable sequence or Promise that reacts first.
   * @param {Observable} rightSource Second observable sequence or Promise.
   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
   */  
  observableProto.amb = function (rightSource) {
    var leftSource = this;
    return new AnonymousObservable(function (observer) {
      var choice,
        leftChoice = 'L', rightChoice = 'R',
        leftSubscription = new SingleAssignmentDisposable(),
        rightSubscription = new SingleAssignmentDisposable();

      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));

      function choiceL() {
        if (!choice) {
          choice = leftChoice;
          rightSubscription.dispose();
        }
      }

      function choiceR() {
        if (!choice) {
          choice = rightChoice;
          leftSubscription.dispose();
        }
      }

      leftSubscription.setDisposable(leftSource.subscribe(function (left) {
        choiceL();
        if (choice === leftChoice) {
          observer.onNext(left);
        }
      }, function (err) {
        choiceL();
        if (choice === leftChoice) {
          observer.onError(err);
        }
      }, function () {
        choiceL();
        if (choice === leftChoice) {
          observer.onCompleted();
        }
      }));

      rightSubscription.setDisposable(rightSource.subscribe(function (right) {
        choiceR();
        if (choice === rightChoice) {
          observer.onNext(right);
        }
      }, function (err) {
        choiceR();
        if (choice === rightChoice) {
          observer.onError(err);
        }
      }, function () {
        choiceR();
        if (choice === rightChoice) {
          observer.onCompleted();
        }
      }));

      return new CompositeDisposable(leftSubscription, rightSubscription);
    });
  };

  /**
   * Propagates the observable sequence or Promise that reacts first.
   *
   * @example
   * var = Rx.Observable.amb(xs, ys, zs);
   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
   */  
  Observable.amb = function () {
    var acc = observableNever(),
      items = argsOrArray(arguments, 0);
    function func(previous, current) {
      return previous.amb(current);
    }
    for (var i = 0, len = items.length; i < len; i++) {
      acc = func(acc, items[i]);
    }
    return acc;
  };

  /**
   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
   */
  observableProto.onErrorResumeNext = function (second) {
    if (!second) {
      throw new Error('Second observable is required');
    }
    return onErrorResumeNext([this, second]);
  };

  /**
   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
   * 
   * @example
   * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
   * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.   
   */
  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
    var sources = argsOrArray(arguments, 0);
    return new AnonymousObservable(function (observer) {
      var pos = 0, subscription = new SerialDisposable(),
      cancelable = immediateScheduler.scheduleRecursive(function (self) {
        var current, d;
        if (pos < sources.length) {
          current = sources[pos++];
          isPromise(current) && (current = observableFromPromise(current));
          d = new SingleAssignmentDisposable();
          subscription.setDisposable(d);
          d.setDisposable(current.subscribe(observer.onNext.bind(observer), function () {
              self();
          }, function () {
              self();
          }));
        } else {
          observer.onCompleted();
        }
      });
      return new CompositeDisposable(subscription, cancelable);
    });
  };

  /**
   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
   *  
   * @example
   *  var res = xs.bufferWithCount(10);
   *  var res = xs.bufferWithCount(10, 1);
   * @param {Number} count Length of each buffer.
   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
   * @returns {Observable} An observable sequence of buffers.    
   */
  observableProto.bufferWithCount = function (count, skip) {
    if (typeof skip !== 'number') {
      skip = count;
    }
    return this.windowWithCount(count, skip).selectMany(function (x) {
      return x.toArray();
    }).where(function (x) {
      return x.length > 0;
    });
  };

    /**
     *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
     *  
     *  var res = xs.windowWithCount(10);
     *  var res = xs.windowWithCount(10, 1);
     * @param {Number} count Length of each window.
     * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
     * @returns {Observable} An observable sequence of windows.  
     */
    observableProto.windowWithCount = function (count, skip) {
        var source = this;
        if (count <= 0) {
            throw new Error(argumentOutOfRange);
        }
        if (arguments.length === 1) {
            skip = count;
        }
        if (skip <= 0) {
            throw new Error(argumentOutOfRange);
        }
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(),
                refCountDisposable = new RefCountDisposable(m),
                n = 0,
                q = [],
                createWindow = function () {
                    var s = new Subject();
                    q.push(s);
                    observer.onNext(addRef(s, refCountDisposable));
                };
            createWindow();
            m.setDisposable(source.subscribe(function (x) {
                var s;
                for (var i = 0, len = q.length; i < len; i++) {
                    q[i].onNext(x);
                }
                var c = n - count + 1;
                if (c >= 0 && c % skip === 0) {
                    s = q.shift();
                    s.onCompleted();
                }
                n++;
                if (n % skip === 0) {
                    createWindow();
                }
            }, function (exception) {
                while (q.length > 0) {
                    q.shift().onError(exception);
                }
                observer.onError(exception);
            }, function () {
                while (q.length > 0) {
                    q.shift().onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    /**
     *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
     *  
     *  var res = obs = xs.defaultIfEmpty();
     *  2 - obs = xs.defaultIfEmpty(false);
     *      
     * @memberOf Observable#
     * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
     * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself. 
     */
    observableProto.defaultIfEmpty = function (defaultValue) {
        var source = this;
        if (defaultValue === undefined) {
            defaultValue = null;
        }
        return new AnonymousObservable(function (observer) {
            var found = false;
            return source.subscribe(function (x) {
                found = true;
                observer.onNext(x);
            }, observer.onError.bind(observer), function () {
                if (!found) {
                    observer.onNext(defaultValue);
                }
                observer.onCompleted();
            });
        });
    };

    /**
     *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
     *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large. 
     * 
     * @example
     *  var res = obs = xs.distinct();
     *  2 - obs = xs.distinct(function (x) { return x.id; });
     *  2 - obs = xs.distinct(function (x) { return x.id; }, function (x) { return x.toString(); });  
     * @param {Function} [keySelector]  A function to compute the comparison key for each element.
     * @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
     */
   observableProto.distinct = function (keySelector, keySerializer) {
        var source = this;
        keySelector || (keySelector = identity);
        keySerializer || (keySerializer = defaultKeySerializer);
        return new AnonymousObservable(function (observer) {
            var hashSet = {};
            return source.subscribe(function (x) {
                var key, serializedKey, otherKey, hasMatch = false;
                try {
                    key = keySelector(x);
                    serializedKey = keySerializer(key);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                for (otherKey in hashSet) {
                    if (serializedKey === otherKey) {
                        hasMatch = true;
                        break;
                    }
                }
                if (!hasMatch) {
                    hashSet[serializedKey] = null;
                    observer.onNext(x);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
     *  
     * @example
     *  var res = observable.groupBy(function (x) { return x.id; });
     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
     * @param {Function} keySelector A function to extract the key for each element.
     * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
     * @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.    
     */
    observableProto.groupBy = function (keySelector, elementSelector, keySerializer) {
        return this.groupByUntil(keySelector, elementSelector, function () {
            return observableNever();
        }, keySerializer);
    };

    /**
     *  Groups the elements of an observable sequence according to a specified key selector function.
     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
     *  
     * @example
     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
     * @param {Function} keySelector A function to extract the key for each element.
     * @param {Function} durationSelector A function to signal the expiration of a group.
     * @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     * @returns {Observable} 
     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
     *      
     */
    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector, keySerializer) {
        var source = this;
        elementSelector || (elementSelector = identity);
        keySerializer || (keySerializer = defaultKeySerializer);
        return new AnonymousObservable(function (observer) {
            var map = {},
                groupDisposable = new CompositeDisposable(),
                refCountDisposable = new RefCountDisposable(groupDisposable);
            groupDisposable.add(source.subscribe(function (x) {
                var duration, durationGroup, element, fireNewMapEntry, group, key, serializedKey, md, writer, w;
                try {
                    key = keySelector(x);
                    serializedKey = keySerializer(key);
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                fireNewMapEntry = false;
                try {
                    writer = map[serializedKey];
                    if (!writer) {
                        writer = new Subject();
                        map[serializedKey] = writer;
                        fireNewMapEntry = true;
                    }
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                if (fireNewMapEntry) {
                    group = new GroupedObservable(key, writer, refCountDisposable);
                    durationGroup = new GroupedObservable(key, writer);
                    try {
                        duration = durationSelector(durationGroup);
                    } catch (e) {
                        for (w in map) {
                            map[w].onError(e);
                        }
                        observer.onError(e);
                        return;
                    }
                    observer.onNext(group);
                    md = new SingleAssignmentDisposable();
                    groupDisposable.add(md);
                    var expire = function  () {
                        if (serializedKey in map) {
                            delete map[serializedKey];
                            writer.onCompleted();
                        }
                        groupDisposable.remove(md);
                    };
                    md.setDisposable(duration.take(1).subscribe(noop, function (exn) {
                        for (w in map) {
                            map[w].onError(exn);
                        }
                        observer.onError(exn);
                    }, function () {
                        expire();
                    }));
                }
                try {
                    element = elementSelector(x);
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                writer.onNext(element);
            }, function (ex) {
                for (var w in map) {
                    map[w].onError(ex);
                }
                observer.onError(ex);
            }, function () {
                for (var w in map) {
                    map[w].onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    /** @private */
    var GroupedObservable = (function (_super) {
        inherits(GroupedObservable, _super);

        function subscribe(observer) {
            return this.underlyingObservable.subscribe(observer);
        }

        /** 
         * @constructor
         * @private
         */
        function GroupedObservable(key, underlyingObservable, mergedDisposable) {
            _super.call(this, subscribe);
            this.key = key;
            this.underlyingObservable = !mergedDisposable ?
                underlyingObservable :
                new AnonymousObservable(function (observer) {
                    return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
                });
        }

        return GroupedObservable;
    }(Observable));

    return Rx;
}));