  function falseFactory() { return false; }
  function emptyArrayFactory() { return []; }

  var ZipObservable = (function(__super__) {
    inherits(ZipObservable, __super__);
    function ZipObservable(sources, resultSelector) {
      var len = sources.length;
      this._s = sources;
      this._cb = resultSelector;
      this._done = arrayInitialize(len, falseFactory);
      this._q = arrayInitialize(len, emptyArrayFactory);
      __super__.call(this);
    }

    ZipObservable.prototype.subscribeCore = function(observer) {
      var n = this._s.length, subscriptions = new Array(n);

      for (var i = 0; i < n; i++) {
        var source = this._s[i], sad = new SingleAssignmentDisposable();
        subscriptions[i] = sad;
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this)));
      }

      return new NAryDisposable(subscriptions);
    };

    return ZipObservable;
  }(ObservableBase));

  var ZipObserver = (function (__super__) {
    inherits(ZipObserver, __super__);
    function ZipObserver(o, i, p) {
      this._o = o;
      this._i = i;
      this._p = p;
      __super__.call(this);
    }

    function countDone(arr, x, j) {
      j !== arr[1]._i && x && arr[0]++;
      return arr;
    }

    function getNextValues(arr, x, i) {
      arr[0][i] = x.shift();
      //If it is complete and the queue is empty then flag for completion
      arr[2][i] && x.length === 0 && (arr[1] = true);
      return arr;
    }

    ZipObserver.prototype.next = function (x) {
      this._p._q[this._i].push(x);
      if (this._p._q.every(function (x) { return x.length > 0; })) {
        var queuedValues = this._p._q.reduce(getNextValues, [new Array(this._p._q.length), false, this._p._done]);
        var res = tryCatch(this._p._cb).apply(null, queuedValues[0]);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._o.onNext(res);
        queuedValues[1] && this._o.onCompleted();
      } else if (this._p._done.reduce(countDone, [0, this])[0] == this._p._done.length - 1) {
        this._o.onCompleted();
      }
    };

    ZipObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ZipObserver.prototype.completed = function () {
      this._p._done[this._i] = true;
      this._p._done.every(identity) && this._o.onCompleted();
    };

    return ZipObserver;
  }(AbstractObserver));

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
   */
  observableProto.zip = function () {
    if (arguments.length === 0) { throw new Error('invalid arguments'); }

    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);

    var parent = this;
    args.unshift(parent);

    return new ZipObservable(args, resultSelector);
  };
