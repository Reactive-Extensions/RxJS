  var MergeAllObservable = (function (__super__) {
    inherits(MergeAllObservable, __super__);

    function MergeAllObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeAllObservable.prototype.subscribeCore = function (observer) {
      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
      g.add(m);
      m.setDisposable(this.source.subscribe(new MergeAllObserver(observer, g)));
      return g;
    };

    return MergeAllObservable;
  }(ObservableBase));

  function MergeAllObserver(observer, group) {
    this.observer = observer;
    this.group = group;
    this.stopped = false;
    this.istStopped = false;
  }

  MergeAllObserver.prototype.onNext = function (innerSource) {
    if (this.isStopped) { return; }
    var innerSubscription = new SingleAssignmentDisposable();
    this.group.add(innerSubscription);
    isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
    innerSubscription.setDisposable(innerSource.subscribe(new MergeAllObserverInnerObserver(this, innerSubscription)));
  };
  MergeAllObserver.prototype.onError = function (e) {
    if(!this.isStopped) {
      this.isStopped = true;
      this.observer.onError(e);
    }
  };
  MergeAllObserver.prototype.onCompleted = function () {
    if(!this.isStopped) {
      this.isStopped = true;
      this.stopped = true;
      this.group.length === 1 && this.observer.onCompleted();
    }
  };
  MergeAllObserver.prototype.dispose = function() { this.isStopped = true; };
  MergeAllObserver.prototype.fail = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.observer.onError(e);
      return true;
    }

    return false;
  };

  function MergeAllObserverInnerObserver(parent, innerSubscription) {
    this.parent = parent;
    this.innerSubscription = innerSubscription;
    this.isStopped = false;
  }
  MergeAllObserverInnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.parent.observer.onNext(x); } };
  MergeAllObserverInnerObserver.prototype.onError = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.parent.observer.onError(e);
    }
  };
  MergeAllObserverInnerObserver.prototype.onCompleted = function () {
    if(!this.isStopped) {
      this.isStopped = true;
      this.parent.group.remove(this.innerSubscription);
      this.parent.stopped && this.parent.group.length === 1 && this.parent.observer.onCompleted();
    }
  };
  InnerObserver.prototype.dispose = function() { this.isStopped = true; };
  InnerObserver.prototype.fail = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.observer.onError(e);
      return true;
    }

    return false;
  };


  /**
  * Merges an observable sequence of observable sequences into an observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.mergeAll = observableProto.mergeObservable = function () {
    return new MergeAllObservable(this);
  };
