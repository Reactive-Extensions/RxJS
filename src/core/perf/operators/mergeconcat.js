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

  var MergeObserver = (function (__super__) {
    function MergeObserver(o, max, g) {
      this.o = o;
      this.max = max;
      this.g = g;
      this.done = false;
      this.q = [];
      this.activeCount = 0;
      __super__.call(this);
    }

    inherits(MergeObserver, __super__);

    MergeObserver.prototype.handleSubscribe = function (xs) {
      var sad = new SingleAssignmentDisposable();
      this.g.add(sad);
      isPromise(xs) && (xs = observableFromPromise(xs));
      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
    };

    MergeObserver.prototype.next = function (innerSource) {
      if(this.activeCount < this.max) {
        this.activeCount++;
        this.handleSubscribe(innerSource);
      } else {
        this.q.push(innerSource);
      }
    };
    MergeObserver.prototype.error = function (e) { this.o.onError(e); };
    MergeObserver.prototype.completed = function () { this.done = true; this.activeCount === 0 && this.o.onCompleted(); };

    function InnerObserver(parent, sad) {
      this.parent = parent;
      this.sad = sad;
      __super__.call(this);
    }

    inherits(InnerObserver, __super__);

    InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
    InnerObserver.prototype.completed = function () {
      this.parent.g.remove(this.sad);
      if (this.parent.q.length > 0) {
        this.parent.handleSubscribe(this.parent.q.shift());
      } else {
        this.parent.activeCount--;
        this.parent.done && this.parent.activeCount === 0 && this.parent.o.onCompleted();
      }
    };

    return MergeObserver;
  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
  * Or merges two observable sequences into a single observable sequence.
  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.merge = function (maxConcurrentOrOther) {
    return typeof maxConcurrentOrOther !== 'number' ?
      observableMerge(this, maxConcurrentOrOther) :
      new MergeObservable(this, maxConcurrentOrOther);
  };
