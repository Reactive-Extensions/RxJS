  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
   *
   * @example
   * var singleObs = source.singleInstance();
   *
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
   */
observableProto.singleInstance = function() {
  var source = this;

  var hasObservable = false;
  var observable;
  var getObservable = function(){
    if(!hasObservable) {
      observable = source.finally(function(){
        hasObservable = false;
      }).publish().refCount();
      hasObservable = true;
    }
    return observable;
  };

  return Observable.create(function(o) {
    return getObservable().subscribe(o);
  });
};