  var ToArrayObservable = (function(__super__) {
    inherits(ToArrayObservable, __super__);
    function ToArrayObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    ToArrayObservable.prototype.subscribeCore = function(observer) {
      return this.source.subscribe(new ToArrayObserver(observer));
    };

    return ToArrayObservable;
  }(ObservableBase));

  var ToArrayObserver = (function(__super__) {
    inherits(ToArrayObserver, __super__);
    function ToArrayObserver(observer) {
      this.observer = observer;
      this.a = [];
      __super__.call(this);
    }
    ToArrayObserver.prototype.next = function (x) { this.a.push(x); };
    ToArrayObserver.prototype.error = function (e) { this.observer.onError(e); };
    ToArrayObserver.prototype.completed = function () {
      this.observer.onNext(this.a);
      this.observer.onCompleted();
    };

    return ToArrayObserver;
  }(AbstractObserver));

  /**
  * Creates an array from an observable sequence.
  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
  */
  observableProto.toArray = function () {
    return new ToArrayObservable(this);
  };
