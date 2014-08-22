  // References
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    CompositeDisposable = Rx.CompositeDisposable,
    AnonymousObservable = Rx.AnonymousObservable,
    isEqual = Rx.internals.isEqual,
    helpers = Rx.helpers,
    not = helpers.not,
    defaultComparer = helpers.defaultComparer,
    identity = helpers.identity,
    defaultSubComparer = helpers.defaultSubComparer,
    isPromise = helpers.isPromise,
    observableFromPromise = Observable.fromPromise;

  // Defaults
  var argumentOutOfRange = 'Argument out of range',
      sequenceContainsNoElements = "Sequence contains no elements.";
  