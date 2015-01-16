  // NoOp
  function NoOpObserver() { }
  NoOpObserver.prototype.onNext = noop;
  NoOpObserver.prototype.onError = noop;
  NoOpObserver.prototype.onCompleted = noop;
  NoOpObserver.instance = new NoOpObserver();

  // Done Observer
  function DoneObserver() { this.error = null; }
  DoneObserver.prototype.onNext = noop;
  DoneObserver.prototype.onError = noop;
  DoneObserver.prototype.onCompleted = noop;
  DoneObserver.instance = new DoneObserver();

  // Disposed Observer
  function objDisposed() { throw new Error('Object has been disposed'); }
  function DisposedObserver() { }
  DisposedObserver.prototype.onNext = objDisposed;
  DisposedObserver.prototype.onError = objDisposed;
  DisposedObserver.prototype.onCompleted = objDisposed;
  DisposedObserver.instance = new DisposedObserver();

  // Main observer
  function InternalObserver(observers) { this._observers = observers; }
  InternalObserver.prototype.onNext = function (x) {
    for(var i = 0, len = this._observers.length; i < len; i++) {
      this._observers[i].onNext(x);
    }
  };
  InternalObserver.prototype.onError = function (e) {
    for(var i = 0, len = this._observers.length; i < len; i++) {
      this._observers[i].onError(e);
    }
  };
  InternalObserver.prototype.onCompleted = function () {
    for(var i = 0, len = this._observers.length; i < len; i++) {
      this._observers[i].onCompleted();
    }
  };
  InternalObserver.prototype.concat = function (o) {
    return new InternalObserver(this._observers.concat(o));
  };
  InternalObserver.prototype.remove = function (o) {
    var os = this._observers.slice(0),i = os.indexOf(o);
    if (i === -1) { return this; }
    os.length === 2 ?
      os[1 - i] :
      new InternalObserver(os.splice(i, 1));
  };
