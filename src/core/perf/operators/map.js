  var MapProducer = (function (__super__) {
    inherits(MapProducer, __super__);

    function MapProducer(source, selector, thisArg) {
      __super__.call(this);
      this.source = source;
      this._selector = bindCallback(selector, thisArg, 3);
    }

    MapProducer.prototype.run = function(observer, cancel, setSink) {
      var sink = new MapImpl(this, observer, cancel);
      setSink(sink);
      return this.source.subscribeSafe(sink);
    };

    var MapImpl = (function (__sub__) {
      inherits(MapImpl, __sub__);

      function MapImpl(parent, observer, cancel) {
        __sub__.call(this, observer, cancel);
        this._parent = parent;
        this._index = 0;
      }

      MapImpl.prototype.onNext = function(x) {
        try {
          var result = this._parent._selector(x, this._index++, this._parent);
        } catch (e) {
          this._observer.onError(e);
          this.dispose();
        }
        this._observer.onNext(result);
      };

      MapImpl.prototype.onError = function(e) {
        this._observer.onError(e);
        this.dispose();
      };

      MapImpl.prototype.onCompleted = function () {
        this._observer.onCompleted();
        this.dispose();
      };

      return MapImpl;
    }(Sink));

    return MapProducer;
  }(Producer));

  /**
  * Projects each element of an observable sequence into a new form by incorporating the element's index.
  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
  */
  observableProto.map = observableProto.select = function (selector, thisArg) {
    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
    return new MapProducer(this, selectorFn, thisArg);
  };
