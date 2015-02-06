  function falseFactory() { return false; }

  var CombineLatestObservable = (function(__super__) {
    inherits(CombineLatestObservable, __super__);
    function CombineLatestObservable(parameters, resultSelector) {
      this.parameters = parameters;
      this.resultSelector = resultSelector;
      this.length = parameters.length;
      this.hasValue = arrayInitialize(this.length, falseFactory);
      this.hasValueAll = false;
      this.isDone = arrayInitialize(this.length, falseFactory);
      this.values = new Array(this.length);
      __super__.call(this);
    }

    CombineLatestObservable.prototype.subscribeCore = function(observer) {
      var self = this, n = this.length, subscriptions = new Array(n);

      for (var idx = 0; idx < n; idx++) {
        (function (i) {
          var source = self.parameters[i], sad = new SingleAssignmentDisposable();
          isPromise(source) && (source = observableFromPromise(source));
          sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, self)));
          subscriptions[i] = sad;
        }(idx));
      }

      return new CompositeDisposable(subscriptions);
    };

    return CombineLatestObservable;
  }(ObservableBase));

  var CombineLatestObserver = (function() {
    function CombineLatestObserver(observer, i, parent) {
      this.observer = observer;
      this.i = i;
      this.parent = parent;
      this.isStopped = false;
    }

    CombineLatestObserver.prototype.onNext = function(x) {
      if (this.isStopped) { return; }
      var i = this.i;
      this.parent.values[i] = x;
      this.parent.hasValue[i] = true;
      if (this.parent.hasValueAll || (this.parent.hasValueAll = this.parent.hasValue.every(identity))) {
        try {
          var res = this.parent.resultSelector.apply(null, this.parent.values);
        } catch (e) {
          return this.observer.onError(e);
        }
        this.observer.onNext(res);
      } else if (this.parent.isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
        this.observer.onCompleted();
      }
    };
    CombineLatestObserver.prototype.onError = function(e) {
      if (!this.isStopped) { this.isStopped = true; this.observer.onError(e); }
    };
    CombineLatestObserver.prototype.onCompleted = function() {
      if (!this.isStopped) {
        this.isStopped = true;
        this.parent.isDone[this.i] = true;
        this.parent.isDone.every(identity) && this.observer.onCompleted();
      }
    };
    CombineLatestObserver.prototype.dispose = function() { this.isStopped = true; };
    CombineLatestObserver.prototype.fail = function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.observer.onError(e);
        return true;
      }

      return false;
    };

    return CombineLatestObserver;
  }());

  /**
  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
  *
  * @example
  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
  */
  var combineLatest = Observable.combineLatest = function () {
    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    var resultSelector = args.pop();
    Array.isArray(args[0]) && (args = args[0]);
    return new CombineLatestObservable(args, resultSelector);
  };
