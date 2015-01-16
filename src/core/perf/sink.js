  var Sink = Rx.internals.Sink = (function () {
    function Sink(observer, cancel) {
      this._observer = observer;
      this._cancel = cancel;
    }

    Sink.prototype.dispose = function () {
      this._observer = NoOpObserver.instance;
      if (this._cancel) {
        this._cancel.dispose();
        this._cancel = null;
      }
    };

    Sink.prototype.getForwarder = function () { return new _(this); };

    function _(forward) { this._forward = forward; }
    _.prototype.onNext = function (x) { this._forward.onNext(x); };
    _.prototype.onError = function (e) {
      this._forward.onError(e);
      this._forward.dispose();
    };
    _.prototype.onCompleted = function () {
      this._forward.onCompleted();
      this._forward.dispose();
    };

    return Sink;
  }());
