  function ArrayIterable(array) {
    this._array = array;
  }

  ArrayIterable.prototype[$iterator$] = function () {
    return new ArrayIterator(this._array);
  };

  function ArrayIterator(array) {
    this._array = array;
    this._length = array.length;
    this._index = 0;
  }

  ArrayIterator.prototype[$iterator$] = function () {
    return this;
  };

  var arrayDoneIterator = { done: true, value: undefined };

  ArrayIterator.prototype.next = function () {
    if (this._index < this._length) {
      var val = this._array[this._index++];
      return { done: false, value: val };
    } else {
      return arrayDoneIterator;
    }
  };

  /**
   * Creates an ES6 Iterable from an observable sequence.
   * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
   */
  observableProto.toIterable = function () {
    var source = this;
    return new AnonymousObservable(function(observer) {
      var arr = [];
      return source.subscribe(
        arr.push.bind(arr),
        observer.onError.bind(observer),
        function () {
          observer.onNext(new ArrayIterable(arr));
          observer.onCompleted();
        });
    });
  };
