  /**
   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
   *  
   * @description
   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
   *  source sequence, this buffer is produced on the result sequence.       
   * @param {Number} count Number of elements to take from the end of the source sequence.
   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
   */
  observableProto.takeLastBuffer = function (count) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var q = [];
      return source.subscribe(function (x) {
        q.push(x);
        q.length > count && q.shift();
      }, observer.onError.bind(observer), function () {
        observer.onNext(q);
        observer.onCompleted();
      });
    });
  };
