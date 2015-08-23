  /**
   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
   * @param {Function} resourceFactory Factory function to obtain a resource object.
   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
   */
  Observable.using = function (resourceFactory, observableFactory) {
    return new AnonymousObservable(function (o) {
      var disposable = disposableEmpty;
      var resource = tryCatch(resourceFactory)();
      if (resource === errorObj) {
        return new CompositeDisposable(observableThrow(resource.e).subscribe(o), disposable);
      }
      resource && (disposable = resource);
      var source = tryCatch(observableFactory)(resource);
      if (source === errorObj) {
        return new CompositeDisposable(observableThrow(source.e).subscribe(o), disposable);
      }
      return new CompositeDisposable(source.subscribe(o), disposable);
    });
  };
