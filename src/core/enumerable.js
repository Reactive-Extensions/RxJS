  var Enumerable = Rx.internals.Enumerable = function () { };

  function IsDisposedDisposable(state) {
    this._s = state;
    this.isDisposed = false;
  }

  IsDisposedDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      this._s.isDisposed = true;
    }
  };

  var ConcatEnumerableObservable = (function(__super__) {
    inherits(ConcatEnumerableObservable, __super__);
    function ConcatEnumerableObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.o.onCompleted(); }

      // Check if promise
      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        o: o,
        subscription: subscription,
        e: this.sources[$iterator$]()
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.o.onError(e); };
    InnerObserver.prototype.completed = function () { this._recurse(this._state); };

    return ConcatEnumerableObservable;
  }(ObservableBase));

  Enumerable.prototype.concat = function () {
    return new ConcatEnumerableObservable(this);
  };

  var CatchErrorObservable = (function(__super__) {
    function CatchErrorObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    inherits(CatchErrorObservable, __super__);

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    CatchErrorObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        e: this.sources[$iterator$](),
        subscription: subscription,
        lastError: null,
        o: o
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
    InnerObserver.prototype.completed = function () { this._state.o.onCompleted(); };

    return CatchErrorObservable;
  }(ObservableBase));

  Enumerable.prototype.catchError = function () {
    return new CatchErrorObservable(this);
  };

  var RepeatEnumerable = (function (__super__) {
    inherits(RepeatEnumerable, __super__);
    function RepeatEnumerable(v, c) {
      this.v = v;
      this.c = c == null ? -1 : c;
    }

    RepeatEnumerable.prototype[$iterator$] = function () {
      return new RepeatEnumerator(this);
    };

    function RepeatEnumerator(p) {
      this.v = p.v;
      this.l = p.c;
    }

    RepeatEnumerator.prototype.next = function () {
      if (this.l === 0) { return doneEnumerator; }
      if (this.l > 0) { this.l--; }
      return { done: false, value: this.v };
    };

    return RepeatEnumerable;
  }(Enumerable));

  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
    return new RepeatEnumerable(value, repeatCount);
  };

  var OfEnumerable = (function(__super__) {
    inherits(OfEnumerable, __super__);
    function OfEnumerable(s, fn, thisArg) {
      this.s = s;
      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
    }
    OfEnumerable.prototype[$iterator$] = function () {
      return new OfEnumerator(this);
    };

    function OfEnumerator(p) {
      this.i = -1;
      this.s = p.s;
      this.l = this.s.length;
      this.fn = p.fn;
    }

    OfEnumerator.prototype.next = function () {
     return ++this.i < this.l ?
       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
       doneEnumerator;
    };

    return OfEnumerable;
  }(Enumerable));

  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
    return new OfEnumerable(source, selector, thisArg);
  };
