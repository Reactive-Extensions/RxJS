  function falseFactory() { return false; }
  function emptyArrayFactory() { return []; }

  var ZipObservable = (function(__super__) {
    inherits(ZipObservable, __super__);
    function ZipObservable(sources, resultSelector) {
      this.sources = sources;
      this.resultSelector = resultSelector;
      this.length = sources.length;
      this.isDone = arrayInitialize(this.length, falseFactory);
      this.queues = arrayInitialize(this.length, emptyArrayFactory);
      __super__.call(this);
    }

    ZipObservable.prototype.subscribeCore = function(observer) {
      var self = this, sources = self.sources, n = this.length, subscriptions = new Array(n);

      for (var idx = 0; idx < n; idx++) {
        (function (i) {
          var source = sources[i], sad = new SingleAssignmentDisposable();
          subscriptions[i] = sad;
          isPromise(source) && (source = observableFromPromise(source));
          sad.setDisposable(source.subscribe(new ZipObserver(observer, i, self)));
        }(idx));
      }

      return new CompositeDisposable(subscriptions);
    };

    return ZipObservable;
  }(ObservableBase));

  function ZipObserver(observer, i, parent) {
    this.observer = observer;
    this.i = i;
    this.parent = parent;
    this.isStopped = false;
  }

  ZipObserver.prototype.onNext = function(x) {
    if (this.isStopped) { return; }
    var i = this.i;
    this.parent.queues[i].push(x);
    if (this.parent.queues.every(function (x) { return x.length > 0; })) {
      var res = tryCatch(this.parent.resultSelector).apply(
        this.parent,
        this.parent.queues.map(function (x) { return x.shift(); })
      );
      if (res === errorObj) { return this.observer.onError(res.e); }
      this.observer.onNext(res);
    } else if (this.parent.isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
      this.observer.onCompleted();
    }
  };
  ZipObserver.prototype.onError = function(e) {
    if (!this.isStopped) { this.isStopped = true; this.observer.onError(e); }
  };
  ZipObserver.prototype.onCompleted = function() {
    if (!this.isStopped) {
      this.isStopped = true;
      this.parent.isDone[this.i] = true;
      this.parent.isDone.every(identity) && this.observer.onCompleted();
    }
  };
  ZipObserver.prototype.dispose = function() { this.isStopped = true; };
  ZipObserver.prototype.fail = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.observer.onError(e);
      return true;
    }

    return false;
  };

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
   * @param arguments Observable sources.
   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  var observableZip = Observable.zip = function () {
    var len = arguments.length, args = new Array(len)
    for(i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = args.pop();
    Array.isArray(args[0]) && (args = args[0]);
    return new ZipObservable(args, resultSelector);
  };
