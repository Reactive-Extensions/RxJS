  /**
   *  Returns a specified number of contiguous elements from the end of an observable sequence.
   *  
   * @example
   *  var res = source.takeLast(5);
   *  
   * @description
   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
   * @param {Number} count Number of elements to take from the end of the source sequence.
   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
   */   
  observableProto.takeLast = function (count) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var q = [];
      return source.subscribe(function (x) {
        q.push(x);
        q.length > count && q.shift();
      }, observer.onError.bind(observer), function () {
        for(var i = 0, len = q.length; i < len; i++) {
          observer.onNext(q[i]);
        }
        observer.onCompleted();
      });
    });
  };
