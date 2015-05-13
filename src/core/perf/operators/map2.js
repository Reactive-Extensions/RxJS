  var MapObservable = (function (__super__) {
    inherits(MapObservable, __super__);

    function MapObservable(source, selector, thisArg) {
      this.source = source;
      this.selector = bindCallback(selector, thisArg, 3);
      __super__.call(this);
    }

    MapObservable.prototype.internalMap = function (selector, thisArg) {
      var self = this;
      return new MapObservable(this.source, function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); }, thisArg)
    };

    MapObservable.prototype.subscribeCore = function (observer) {
      return this.source.subscribe(onNext(observer, this.selector, this), onError(observer), onCompleted(observer));
    };
    
    function onNext(observer, selector, source) {
      var i = 0;
      return function (x) {
        var result = tryCatch(selector)(x, i++, source);
        if (result === errorObj) {
          observer.onError(result.e);
        } else { 
          observer.onNext(result); 
        }
      }
    };
    
    function onError(observer) {
      return function (err) { observer.onError(err); };
    }
    
    function onCompleted(observer) {
      return function () { observer.onCompleted(); };
    }

    return MapObservable;

  }(ObservableBase));

  /**
  * Projects each element of an observable sequence into a new form by incorporating the element's index.
  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
  */
  observableProto.map = observableProto.select = function (selector, thisArg) {
    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
    return this instanceof MapObservable ?
      this.internalMap(selectorFn, thisArg) :
      new MapObservable(this, selectorFn, thisArg);
  };
