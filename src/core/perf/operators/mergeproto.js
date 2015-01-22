  var MergeObservable = (function (__super__) {
    inherits(MergeObservable, __super__);

    function MergeObservable(source, maxConcurrent) {
      this.source = source;
      this.maxConcurrent = maxConcurrent;
      __super__.call(this);
    }

    MergeObservable.prototype.subscribeCore = function(observer) {
      var g = new CompositeDisposable();
      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
      return g;
    };

    return MergeObservable;

  }(ObservableBase));

  var MergeObserver = (function(__super__) {
    inherits(MergeObserver, __super__);

    function MergeObserver(observer, maxConcurrent, g) {
      this.observer = observer;
      this.maxConcurrent = maxConcurrent;
      this.g = g;
      this.stopped = false;
      this.q = [];
      this.activeCount = 0;
      __super__.call(this);
    }

    MergeObserver.prototype.handleSubscribe = function (xs) {
      var subscription = new SingleAssignmentDisposable();
      this.g.add(subscription);

      // Check for promises support
      isPromise(xs) && (xs = observableFromPromise(xs));
      subscription.setDisposable(xs.subscribe(new InnerObserver(xs, this, subscription)));
    };

    MergeObserver.prototype.next = function (innerSource) {
      if(this.activeCount < this.maxConcurrent) {
        this.activeCount++;
        this.handleSubscribe(innerSource);
      } else {
        this.q.push(innerSource);
      }
    };

    MergeObserver.prototype.error = function (e) {
      this.observer.onError(e);
    };

    MergeObserver.prototype.completed = function () {
      this.stopped = true;
      this.activeCount === 0 && this.observer.onCompleted();
    };

    var InnerObserver = (function(__base__) {
      inherits(InnerObserver, __base__);
      function InnerObserver(xs, self, subscription) {
        this.xs = xs;
        this.self = self;
        this.subscription = subscription;
        __base__.call(this);
      }
      InnerObserver.prototype.next = function(x) { this.self.observer.onNext(x); };
      InnerObserver.prototype.error = function(e) { this.self.observer.onError(e); };
      InnerObserver.prototype.completed = function () {
        this.self.g.remove(this.subscription);
        if (this.self.q.length > 0) {
          this.self.handleSubscribe(this.self.q.shift());
        } else {
          this.self.activeCount--;
          this.self.stopped && this.self.activeCount === 0 && this.self.observer.onCompleted();
        }
      };

      return InnerObserver;
    }(AbstractObserver));

    return MergeObserver;

  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
  * Or merges two observable sequences into a single observable sequence.
  *
  * @example
  * 1 - merged = sources.merge(1);
  * 2 - merged = source.merge(otherSource);
  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.merge = function (maxConcurrentOrOther) {
    return typeof maxConcurrentOrOther !== 'number' ?
      observableMerge(this, maxConcurrentOrOther) :
      new MergeObservable(this, maxConcurrentOrOther);
  };
