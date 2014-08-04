  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var index = 0;

      return source.subscribe(
        function (x) {
          observer.onNext(onNext.call(thisArg, x, index++));
        },
        function (err) {
          observer.onNext(onError.call(thisArg, err));
          observer.onCompleted();
        }, 
        function () {
          observer.onNext(onCompleted.call(thisArg));
          observer.onCompleted();
        });
    }).mergeAll();
  };