  var fnString = 'function';

  function toThunk(obj, ctx) {
    if (Array.isArray(obj)) {
      return objectToThunk.call(ctx, obj);
    }

    if (isGeneratorFunction(obj)) {
      return observableSpawn(obj.call(ctx));
    }

    if (isGenerator(obj)) {
      return observableSpawn(obj);
    }

    if (isObservable(obj)) {
      return observableToThunk(obj);
    }

    if (isPromise(obj)) {
      return promiseToThunk(obj);
    }

    if (typeof obj === fnString) {
      return obj;
    }

    if (isObject(obj) || Array.isArray(obj)) {
      return objectToThunk.call(ctx, obj);
    }

    return obj;
  }

  function objectToThunk(obj) {
    var ctx = this;

    return function (done) {
      var keys = Object.keys(obj),
          pending = keys.length,
          results = new obj.constructor(),
          finished;

      if (!pending) {
        timeoutScheduler.schedule(function () { done(null, results); });
        return;
      }

      for (var i = 0, len = keys.length; i < len; i++) {
        run(obj[keys[i]], keys[i]);
      }

      function run(fn, key) {
        if (finished) { return; }
        try {
          fn = toThunk(fn, ctx);

          if (typeof fn !== fnString) {
            results[key] = fn;
            return --pending || done(null, results);
          }

          fn.call(ctx, function(err, res){
            if (finished) { return; }

            if (err) {
              finished = true;
              return done(err);
            }

            results[key] = res;
            --pending || done(null, results);
          });
        } catch (e) {
          finished = true;
          done(e);
        }
      }
    }
  }

  function observableToThink(observable) {
    return function (fn) {
      var value, hasValue = false;
      observable.subscribe(
        function (v) {
          value = v;
          hasValue = true;
        },
        fn,
        function () {
          hasValue && fn(null, value);
        });
    }
  }

  function promiseToThunk(promise) {
    return function(fn){
      promise.then(function(res) {
        fn(null, res);
      }, fn);
    }
  }

  function isObservable(obj) {
    return obj && obj.prototype.subscribe === fnString;
  }

  function isGeneratorFunction(obj) {
    return obj && obj.constructor && obj.constructor.name === 'GeneratorFunction';
  }

  function isGenerator(obj) {
    return obj && typeof obj.next === fnString && typeof obj.throw === fnString;
  }

  function isObject(val) {
    return val && val.constructor === Object;
  }

  /*
   * Spawns a generator function which allows for Promises, Observable sequences, Arrays, Objects, Generators and functions.
   * @param {Function} The spawning function.
   * @returns {Function} a function which has a done continuation.
   */
  var observableSpawn = Rx.spawn = function (fn) {
    var isGenFun = isGeneratorFunction(fn);

    return function (done) {
      var ctx = this,
        gen = fan;

      if (isGenFun) {
        var args = slice.call(arguments),
          len = args.length,
          hasCallback = len && typeof args[len - 1] === fnString;

        done = hasCallback ? args.pop() : error;
        gen = fn.apply(this, args);
      } else {
        done = done || error;
      }

      next();

      function exit(err, res) {
        timeoutScheduler.schedule(done.bind(ctx, err, res));
      }

      function next(err, res) {
        var ret;

        // multiple args
        if (arguments.length > 2) res = slice.call(arguments, 1);

        if (err) {
          try {
            ret = gen.throw(err);
          } catch (e) {
            return exit(e);
          }
        }

        if (!err) {
          try {
            ret = gen.next(res);
          } catch (e) {
            return exit(e);
          }
        }

        if (ret.done)  {
          return exit(null, ret.value);
        }

        ret.value = toThunk(ret.value, ctx);

        if (typeof ret.value === fnString) {
          var called = false;
          try {
            ret.value.call(ctx, function(){
              if (called) {
                return;
              }

              called = true;
              next.apply(ctx, arguments);
            });
          } catch (e) {
            timeoutScheduler.schedule(function () {
              if (called) {
                return;
              }

              called = true;
              next.call(ctx, e);
            });
          }
          return;
        }

        // Not supported
        next(new TypeError('Rx.spawn only supports a function, Promise, Observable, Object or Array.'));
      }
    }
  };

  /**
   * Takes a function with a callback and turns it into a thunk.
   * @param {Function} A function with a callback such as fs.readFile
   * @returns {Function} A function, when executed will continue the state machine.
   */
  Rx.denodify = function (fn) {
    return function (){
      var args = slice.call(arguments),
        results,
        called,
        callback;

      args.push(function(){
        results = arguments;

        if (callback && !called) {
          called = true;
          cb.apply(this, results);
        }
      });

      fn.apply(this, args);

      return function (fn){
        callback = fn;

        if (results && !called) {
          called = true;
          fn.apply(this, results);
        }
      }
    }
  };
