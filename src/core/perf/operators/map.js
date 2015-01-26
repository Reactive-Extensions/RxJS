  var MapObservable = (function (__super__) {
    inherits(MapObservable, __super__);

    function MapObservable(source, selector, thisArg) {
      this.source = source;
      this.selector = bindCallback(selector, thisArg, 3);
      __super__.call(this);
    }

    MapObservable.prototype.internalMap = function (selector, thisArg) {
      var self = this;
      return new MapObservable(this.source, function (x, i, o) { return selector(self.selector(x, i, o), i, o); }, thisArg)
    };

    MapObservable.prototype.internalMapFilter = function (predicate, thisArg) {
      var self = this;
      return new FilterObservable(this.source, function (x, i, o) { return predicate(self.selector(x, i, o), i, o); }, thisArg);
    };

    MapObservable.prototype.subscribeCore = function (observer) {
      return this.source.subscribe(new MapObserver(observer, this.selector, this));
    };

    return MapObservable;

  }(ObservableBase));

  var MapObserver = (function (__super__) {
    inherits(MapObserver, __super__);

    function MapObserver(observer, selector, source) {
      this.observer = observer;
      this.selector = selector;
      this.source = source;
      this.index = 0;
      __super__.call(this);
    }

    MapObserver.prototype.next = function(x) {
      try {
        var result = this.selector(x, this.index++, this.source);
      } catch(e) {
        return this.observer.onError(e);
      }
      this.observer.onNext(result);
    };

    MapObserver.prototype.error = function (e) {
      this.observer.onError(e);
    };

    MapObserver.prototype.completed = function () {
      this.observer.onCompleted();
    };

    return MapObserver;
  }(AbstractObserver));

  /**
  * Projects each element of an observable sequence into a new form by incorporating the element's index.
  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
  */
  observableProto.map = observableProto.select = function (selector, thisArg) {
    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
    return this instanceof MapObservable ?
      this.internalMap(selector, thisArg) :
      new MapObservable(this, selectorFn, thisArg);
  };
