/**
* Inspired by Knockout.js and RxJS-Splash
*/

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
          root.tko = factory(root, exports, Rx);
          return root.tko;
      });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
      module.exports = factory(root, module.exports, require('rx'));
  } else {
      root.tko = factory(root, {}, root.Rx);
  }
}(this, function (global, exp, Rx, undefined) {

  var Observer = Rx.Observer,
      Observable = Rx.Observable,
      observableCreate = Rx.Observable.create,
      fromEvent = Rx.Observable.fromEvent,
      BehaviorSubject = Rx.BehaviorSubject,
      Subject = Rx.Subject,
      CompositeDisposable = Rx.CompositeDisposable,
      disposableCreate = Rx.Disposable.create,
      disposableEmpty = Rx.Disposable.empty,
      timeoutScheduler = Rx.Scheduler.timeout,
      inherits = Rx.internals.inherits,
      splice = Array.prototype.splice;

  var sub = 'subscribe',
      fn = 'function',
      onNext = 'onNext';

  function noop () { }

  var tko = { };

  var ObservableArray = (function (_super) {

      function ObservableArray(items) {
          this.values = [];
          this.lifetimes = [];
          for (var i = 0, len = items.length; i < len; i++) {
              this.push(items[i]);
          }

          _super.call(this);
      }

      inherits(ObservableArray, _super);

      var observableArrayPrototype = ObservableArray.prototype;

      observableArrayPrototype.subscribe = function (observerOrOnNext) {
          observerOrOnNext || (observerOrOnNext = noop);
          var subscription = _super.prototype.subscribe.apply(this, arguments);

          this.purge();
          var obsFunc = typeof observerOrOnNext === fn ? 
              observerOrOnNext :
              observerOrOnNext.onNext;

          for(var i = 0, len = this.lifetimes.length; i < len; i++) {
              obsFunc(this.lifetimes[i]);
          }

          return subscription;
      };

      observableArrayPrototype.push = function (item) {
          this.values.push(value);
          var lifetime = new BehaviorSubject(value);
          this.lifetimes.push(lifetime);
          this.onNext(lifetime);

          return this.values.length;
      };

      observableArrayPrototype.remove = function (value) {
          var index = this.values.indexOf(value);

          this.splice(index, 1);

          return index !== -1;
      };

      observableArrayPrototype.splice = function () {
          splice.apply(this.values, arguments);
          var removed = spliced.apply(this.lifetimes, arguments);

          for (var i = 0, len = removed.length; i < len; i++) {
              removed[i].onCompleted();
          }
      };

      observableArrayPrototype.dispose = function () {
          for (var i = 0, len = this.lifetimes.length; i < len; i++) {
              this.lifetimes[i].onCompleted();
          }
      };

      observableArrayPrototype.purge = function () {
          for (var i = 0, len = this.lifetimes.length; i < len; i++) {
              var lifetime = this.lifetimes[i];
              if (lifetime.isCompleted) {
                  this.remove(lifetime);
              }
          }
      };

      return ObservableArray;
  }(Subject));

  tko.binders = {
      attr: function (target, context, options) {
          var disposable = new CompositeDisposable();

          for (var key in options) {
              (function (key) {
                  var obsOrValue = options[key];
                  disposable.add(tko.utils.applyBindings(obsOrValue, function (x) {
                      target.attr(key, x);
                  }));
              }(key));
          }

          return disposable;
      },
      checked: function (target, context, obsOrValue) {
          var disposable = new CompositeDisposable();
          if (onNext in obsOrValue) {
              var observer = obsOrValue;

              disposable.add(fromEvent(target, 'change')
                  .map(function () {
                          return target.prop('checked');
                      })
                  .subscribe(observer.onNext.bind(observer)));
          }
          disposable.add(tko.utils.applyBindings(obsOrValue, function (x) {
              target.prop('checked', x);
          }));

          return disposable;
      },
      click: function (target, context, options) {
          return tko.binders.event(target, context, options, 'click');
      },
      css: function (target, context, options) {
          var disposable = new CompositeDisposable();

          for (var key in options) {
              (function (key) {
                  disposable.add(tko.utils.applyBindings(options[key], function (x) {
                      target.toggleClass(css, x);
                  }));
              }(key));
          }

          return disposable;
      },
      event: function (target, context, options, type) {
          type || (type = options.type);
          var obs = fromEvent(target, type);

          return obs.subscribe(function (e) {
              var opts = {
                  target: target,
                  context: context,
                  e: e
              };
              if (typeof options === fn) {
                  options(opts);
              } else {
                  options.onNext(opts);
              }
          });
      },
      foreach: function (target, context, obsArray) {
          var disposable = new CompositeDisposable();

          var template = target.html().trim();

          disposable.add(disposableCreate(function () {
              target.empty().append(template);
          }));

          timeoutScheduler.schedule(function () {
              disposable.add(obsArray.subscribe(function (lifetime) {
                  var sub,
                      disposer,
                      child = $(template).appendTo(target),
                      binding = tko.internal.applyBindings(child, {
                          viewModel: lifetime.value,
                          viewModelRoot: context. viewModelRoot,
                          viewModelParent: context.viewModel
                      }),

                      dispose = function () {
                          child.remove();
                          disposable.remove(binding);
                          disposable.remove(disposer);
                          disposable.remove(sub);
                      },

                      disposer = disposableCreate(dispose),

                      sub = lifetime.subscribe(noop, dispose, dispose);

                  disposable.add(binding);
                  disposable.add(disposer);
                  disposable.add(sub);
              }));
          });

          return disposable;
      },
      html: function (target, context, obsOrValue) {
          return tko.utils.applyBindings(obsOrValue, target.html.bind(target));
      },
      text: function (target, context, obsOrValue) {
          return tko.utils.applyBindings(obsOrValue, target.text.bind(target));
      },
      value: function (target, context, options) {
          var disposable = new CompositeDisposable();

          var options = tko.utils.parseBindingOptions(options);
          if (options.on && options.on.indexOf('after') === 0) {
              options.on = options.on.slice(5);
              options.delay = true;
          }
          if (typeof options.source.onNext === fn) {
              var observer = options.source,
                  getObs = fromEvent(target, options.on || 'change');

              if (options.delay)  {
                  getObs = getObs.delay(0);
              }

              disposable.add(getObs
                  .map(function () {
                      return target.val();
                  })
                  .subscribe(observer.onNext.bind(observer))
              );
          }

          if (options.source instanceof Observable) {
              var focus = fromEvent(target, 'focus'),
                  blur = fromEvent(target,'blur');

              options.source = options.source.takeUntil(focus).concat(blur.take(1)).repeat();
          }

          disposable.add(tko.utils.applyBindings(options.source, target.val.bind(target)));

          return disposable;
      },
      visible: function (target, context, options) {
          return tko.utils.applyBindings(obsOrValue, function (x) {
              taget.css(x ? '' : 'none');
          });
      }
  };

  tko.utils = {
    applyBindings: function (obsOrValue, cb) {
      if (sub in obsOrValue) {
        return obsOrValue.subscribe(cb);
      }
      cb(obsOrValue);
      return disposableEmpty;
    },
    wrap: function (valueOrBehavior) {
      return sub in valueOrBehavior ?
        valueOrBehavior :
        new BehaviorSubject(valueOrBehavior);
    },
    parseBindingOptions: function (param, options) {
      options || (options = {});
      if (typeof param === sub || onNext in param || sub in param) {
        options.source = param;
        return options;
      }
      for (var prop in param) {
        options[prop] = param[prop];
      }
      return options;
    },
    toJSON: function (obj) {
      return JSON.stringify(function (s, field) {
        if (field instanceof ObservableArray) {
          return field.values;
        }
        if (field instanceof Observable) {
          return field.value;
        }
        if (field instanceof Observer) {
          return undefined;
        }
        return field;
      });
    },
    unwrap: function (valueOrBehavior) {
      return 'value' in valueOrBehavior && sub in valueOrBehavior ?
        valueOrBehavior.value :
        valueOrBehavior;
    }
  };

  tko.internal = {
    applyBindings: function (target, context) {
      var bindings = tko.internal.parseBindings(target, context),
        disposable = new CompositeDisposable();
      for (var binder in bindings) {
        disposable.add(tko.binders[binder](target, context, bindings[binder]));
      }

      target.children().each(function () {
        disposable.add(tko.internal.applyBindings($(this), context));
      });

      return disposable;
    },
    parseBindings: function (target, context) {
      var binding = target.attr('data-tko');
      if (!binding) { return null; }
      var keys = ['$data', '$root', '$parent'],
        values = [context.viewModel, context.viewModelRoot, context.viewModelParent];
      for (var key in context.viewModel) {
        keys.push(key);
        values.push(context.viewModel[key]);
      }

      return new Function(keys, 'return { ' + binding + ' };').apply(null, values);
    }
  };

  tko.applyBindings = function (vm, target) {
    target || (target = $(window.document.body));
    return tko.internal.applyBindings(target, {
      viewModel: vm,
      viewModelRoot: vm,
      viewModelParent: null
    });
  };

  tko.observableArray = function (items) {
    !arguments.length && (items = []);
    return new ObservableArray(items);
  };

  tko.behavior = function (value) {
      return new Rx.BehaviorSubject(value);
  };

  /**
   *   var obs = tko.computed({
   *       params: {
   *           a: Rx.Observable.interval(100),
   *           b: Rx.Observable.interval(250),
   *           c: Rx.Observable.interval(75),
   *           d: Rx.Observable.interval(650)
   *       },
   *       read: function (params) {
   *           return params.a + ":" + params.b + ":" + params.c + ":" + params.d;
   *       }
   *   });
   *   
   *   obs.subscribe(function (x) {
   *       console.log(x);
   *   });
  */
  tko.computed = function (options) {
    var keys = [], values = [];
    for (var prop in options.params) {
      keys.push(prop);
      values.push(tko.utils.wrap(options.params[prop]));
    }

    var source = Rx.Observable.combineLatest(values, function () {
      var args = arguments, params = {};
      for (var i = 0, len = keys.length; i < len; i++) {
        params[keys[i]] = args[i];
      }
      return params;
    });

    return observableCreate(function (o) {
      return source.map(options.read).subscribe(o);
    });
  };

  return tko;

}));
