  var WindowedObservable = (function (_super) {

    function subscribe (observer) {
      this.subscription = this.source.subscribe(new WindowedObserver(observer, this, this.subscription, this.scheduler));

      var self = this;
      self.scheduler.schedule(function () {
        self.source.request(self.windowSize);
      });

      return this.subscription;
    }

    inherits(WindowedObservable, _super);

    function WindowedObservable(source, windowSize, scheduler) {
      _super.call(this, subscribe);
      this.source = source;
      this.windowSize = windowSize;
      this.scheduler = scheduler;
      this.isDisposed = false;
    }

    var WindowedObserver = (function (__super) {

      inherits(WindowedObserver, __super);

      function WindowedObserver(observer, observable, cancel, scheduler) {
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
        this.scheduler = scheduler;
        this.received = 0;
        this.isDisposed = false;
      }

      var windowedObserverPrototype = WindowedObserver.prototype;

      windowedObserverPrototype.onCompleted = function () {
        checkDisposed.call(this);
        this.observer.onCompleted();
        this.dispose();
      };

      windowedObserverPrototype.onError = function (error) {
        checkDisposed.call(this);
        this.observer.onError(error);
        this.dispose();
      };

      windowedObserverPrototype.onNext = function (value) {
        checkDisposed.call(this);
        this.observer.onNext(value);

        this.received = ++this.received % this.observable.windowSize;
        if (this.received === 0) {
          var self = this;
          self.scheduler.schedule(function () {
            console.log('requested size', self.observable.windowSize);
            self.observable.source.request(self.observable.windowSize);
          });
        }
      };

      windowedObserverPrototype.dispose = function () {
        this.observer = null;
        if (!!this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        this.isDisposed = true;
      };

      return WindowedObserver;
    }(Observer));

    return WindowedObservable;
  }(Observable));
