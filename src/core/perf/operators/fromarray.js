  var FromArrayObservable = (function(__super__) {
    inherits(FromArrayObservable, __super__);
    function FromArrayObservable(args, scheduler) {
      this.args = args;
      this.scheduler = scheduler || currentThreadScheduler;
      __super__.call(this);
    }

    FromArrayObservable.prototype.subscribeCore = function (observer) {
      var sink = new FromArraySink(observer, this);
      return sink.run();
    };

    return FromArrayObservable;
  }(ObservableBase));

  var FromArraySink = (function () {
    function FromArraySink(observer, parent) {
      this.observer = observer;
      this.parent = parent;
    }

    function loopRecursive(state, recurse) {
      if (state.i < state.len) {
        state.observer.onNext(state.args[state.i++]);
        recurse(state);
      } else {
        state.observer.onCompleted();
      }
    }

    FromArraySink.prototype.run = function () {
      return this.parent.scheduler.scheduleRecursiveWithState(
        {i: 0, args: this.parent.args, len: this.parent.args.length, observer: this.observer },
        loopRecursive);
    };

    return FromArraySink;
  }());

  /**
  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
  * @deprecated use Observable.from or Observable.of
  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
  */
  var observableFromArray = Observable.fromArray = function (array, scheduler) {
    return new FromArrayObservable(array, scheduler)
  };
