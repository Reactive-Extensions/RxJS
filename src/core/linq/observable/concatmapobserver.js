  observableProto.concatMapObserver = function(onNext, onError, onCompleted) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var index = 0;

      return source.subscribe(
        function (x) {
          observer.onNext(onNext(x, index++));
        },
        function (err) {
          observer.onNext(onError(err));
          observer.completed();
        }, 
        function () {
          observer.onNext(onCompleted());
          observer.onCompleted();
        });
    }).concatAll();
  };