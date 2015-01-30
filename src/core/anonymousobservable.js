  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
    inherits(AnonymousObservable, __super__);

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
        currentThreadScheduler.scheduleWithState(ado, function (x, ado) { return self.scheduledSubscribe(x, ado); })
      } else {
        try {
          ado.setDisposable(fixSubscriber(this.subscribeCore(ado)));
        } catch (e) {
          if (!ado.fail(e)) { throw e; }
        }
      }

      return ado;
    }

    function AnonymousObservable(subscribeMethod, parent) {
      this.source = parent;
      this.subscribeCore = subscribeMethod;

      __super__.call(this, subscribe);
    }

    AnonymousObservable.prototype.scheduledSubscribe = function (x, ado) {
      try {
        ado.setDisposable(fixSubscriber(this.subscribeCore(ado)));
      } catch (e) {
        if (!ado.fail(e)) { throw e; }
      }
      return disposableEmpty;
    };

    return AnonymousObservable;

  }(Observable));
