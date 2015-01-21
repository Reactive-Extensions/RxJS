  var ObservableBase = Rx.ObservableBase = (function (__super__) {

  inherits(ObservableBase, __super__);

  // Fix subscriber to check for undefined or function returned to decorate as Disposable
  function fixSubscriber(subscriber) {
    if (subscriber && typeof subscriber.dispose === 'function') { return subscriber; }

      return typeof subscriber === 'function' ?
        disposableCreate(subscriber) :
        disposableEmpty;
    }

    function subscribe(observer) {
      var self = this;
      var ado = new AutoDetachObserver(observer);
      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.scheduleWithState(ado, function (_, ado) { return self.scheduledSubscribe(_, ado); })
      } else {
        ado.setDisposable(fixSubscriber(this.subscribeCore(ado)));
      }

      return ado;
    }

    function ObservableBase() {
      __super__.call(this, subscribe);
    }

    ObservableBase.prototype.scheduledSubscribe = function (_, autoDetachObserver) {
      try {
        autoDetachObserver.setDisposable(fixSubscriber(this.subscribeCore(autoDetachObserver)));
      } catch (e) {
        if (!autoDetachObserver.fail(e)) {
          throw e;
        }
      }
      return disposableEmpty;
    };

    return ObservableBase;

  }(Observable));
