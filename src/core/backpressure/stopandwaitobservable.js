  var StopAndWaitObservable = (function (_super) {

    function subscribe (observer) {
      var self = this;

      this.subscription = this.source.subscribe(new StopAndWaitObserver(observer, this, this.subscription, this.scheduler));

      self.scheduler.schedule(function () {
        self.source.request(1);
      });

      return this.subscription;
    }

    function StopAndWaitObservable (source, scheduler) {
      _super.call(this, subscribe);
      this.scheduler = scheduler;
      this.source = source;
    }

    var StopAndWaitObserver = (function (__super) {

      function StopAndWaitObserver (observer, observable, cancel, scheduler) {
        __super.call(this);
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
        this.isDisposed = false;
      }

      var stopAndWaitObserverProto = StopAndWaitObserver.prototype;

      stopAndWaitObserverProto.onCompleted = function () {
        checkDisposed.call(this);

        this.observer.onCompleted();
        this.dispose();
      };

      stopAndWaitObserverProto.onError = function (error) {
        checkDisposed.call(this);

        this.observer.onError(error);
        this.dispose();
      }

      stopAndWaitObserverProto.onNext = function (value) {
        checkDisposed.call(this);

        this.observer.onNext(value);

        var self = this;
        this.scheduler.schedule(function () {
          self.observable.source.request(1);
        });
      };

      stopAndWaitObserverProto.dispose = function () {
        this.observer = null;
        if (this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        this.isDisposed = true;
      };

      return StopAndWaitObserver;
    }(Observer));

    return StopAndWaitObservable;
  }(Observable));
