  /**
   * Projects each element of an observable sequence into a new form by incorporating the element's index.
   * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source. 
   */  
  observableProto.select = observableProto.map = function (selector, thisArg) {
    return new MapObservable(this, selector, thisArg);
  };

  var MapObserver = (function (__super__) {
    
    inherits(MapObserver, __super__);

    function MapObserver(observable, observer) {
      __super__.call(this);
      this.observable = observable;
      this.observer = observer;
    }
    
    MapObserver.prototype.next = function (x) {
      var result, observable = this.observable, observer = this.observer;
      try {
        result = observable.selector.call(observable.thisArg, x, observable.index++, observable);
      } catch (e) {
        observer.onError(e);
        return;
      }
      
      observer.onNext(result);
    };
    
    MapObserver.prototype.error = function (err) { this.observer.onError(err); };
    MapObserver.prototype.completed = function () { this.observer.onCompleted(); };
    
    return MapObserver;
  }(AbstractObserver));

  var MapObservable = (function (__super__) {
    inherits(MapObservable, __super__);
    
    function subscribe(observer) {
      return this.source.subscribe(new MapObserver(this, observer));
    }
    
    function MapObservable(source, selector, thisArg) {
      __super__.call(this, subscribe);
      this.source = source;
      this.selector = selector;
      this.thisArg = thisArg;
      this.index = 0;  
    }
    
    return MapObservable;
  }(AnonymousObservable));
