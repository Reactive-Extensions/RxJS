  var MergeAllObservable = (function (__super__) {
    inherits(MergeAllObservable, __super__);

    function MergeAllObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeAllObservable.prototype.subscribeCore = function (observer) {
      var g = new CompositeDisposable(),
        m = new SingleAssignmentDisposable();
      g.add(m);
      m.setDisposable(this.source.subscribe(new MergeAllObserver(observer, g)));
      return g;
    };

    return MergeAllObservable;
  }(ObservableBase));

  var MergeAllObserver = (function (__super__) {

    inherits(MergeAllObserver, __super__);

    function MergeAllObserver(observer, group) {
      this.observer = observer;
      this.group = group;
      this.stopped = false;
      __super__.call(this);
    }

    MergeAllObserver.prototype.next = function (innerSource) {
      var innerSubscription = new SingleAssignmentDisposable();
      this.group.add(innerSubscription);

      // Check for promises support
      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

      innerSubscription.setDisposable(innerSource.subscribe(new InnerObserver(this, innerSubscription)));
    };

    MergeAllObserver.prototype.error = function (e) {
      this.observer.onError(e);
    };

    MergeAllObserver.prototype.completed = function () {
      this.stopped = true;
      this.group.length === 1 && this.observer.onCompleted();
    };

    var InnerObserver = (function (__base__) {
      inherits(InnerObserver, __base__)
      function InnerObserver(parent, innerSubscription) {
        this.parent = parent;
        this.innerSubscription = innerSubscription;
        __base__.call(this);
      }
      InnerObserver.prototype.next = function (x) { this.parent.observer.onNext(x); };
      InnerObserver.prototype.error = function (e) { this.parent.observer.onError(e); };
      InnerObserver.prototype.completed = function () {
        this.parent.group.remove(this.innerSubscription);
        this.parent.stopped && this.parent.group.length === 1 && this.parent.observer.onCompleted();
      };

      return InnerObserver;
    }(AbstractObserver));

    return MergeAllObserver;

  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.mergeAll = observableProto.mergeObservable = function () {
    return new MergeAllObservable(this);
  };
