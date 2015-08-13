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
    inherits(MergeObserver, __super__);
    function MergeObserver(o, max, g) {
      this.o = o;
      this.max = max;
      this.g = g;
      this.done = false;
      this.q = [];
      this.activeCount = 0;
      this.isStopped = false;
      __super__.call(this);
    }

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

      MergeObserver.prototype.error = function (e) {
        this.o.onError(e);
      };

      MergeObserver.prototype.completed = function () {
        this.done = true;
        this.activeCount === 0 && this.o.onCompleted();
      };

      var InnerObserver = (function(__super__) {
        inherits(InnerObserver, __super__);
        function InnerObserver(parent, sad) {
          this.parent = parent;
          this.sad = sad;
          __super__.call(this);
        }

        InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
        InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
        InnerObserver.prototype.completed = function () {
          var parent = this.parent;
          parent.g.remove(this.sad);
          if (parent.q.length > 0) {
            parent.handleSubscribe(parent.q.shift());
          } else {
            parent.activeCount--;
            parent.done && parent.activeCount === 0 && parent.o.onCompleted();
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
    return typeof maxConcurrentOrOther === 'number' ?
      new MergeObservable(this, maxConcurrentOrOther) :
      observableMerge(this, maxConcurrentOrOther);

  };
