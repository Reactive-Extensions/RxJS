	var WindowedObservable = (function (_super) {

		function subscribe (observer) {
			var subscription = this.source.subscribe(new WindowedObserver(observer, this, subscription));

			// TODO: Refactor out to scheduler for testability
			var self = this;
			timeoutScheduler.schedule(function () {
				self.source.request(self.windowSize);
			});

			return subscription;
		}

		inherits(WindowedObservable, _super);

		function WindowedObservable(source, windowSize) {
			_super.call(this, subscribe);
			this.source = source;
			this.windowSize = windowSize;
			this.isDisposed = false;
		}

		var WindowedObserver = (function (__super) {

			inherits(WindowedObserver, __super);

			function WindowedObserver(observer, observable, cancel) {
				this.observer = observer;
				this.observable = observable;
				this.cancel = cancel;
				this.received = 0;
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

					// TODO: Refactor out to scheduler for testability
					var self = this;
					timeoutScheduler.schedule(function () {
						self.observable.source.request(self.observable.windowSize);
					});
				}
			};

			windowedObserverPrototype.dispose = function () {
				this.observer = null;
				if (!!this.cancel) {
					this.cancel.dispose();
				}
				this.isDisposed = true;
			};

			return WindowedObserver;
		}(Observer));

		return WindowedObservable;
	}(Observable));