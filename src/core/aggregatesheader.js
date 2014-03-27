    // References
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        CompositeDisposable = Rx.CompositeDisposable,
        AnonymousObservable = Rx.AnonymousObservable,
        isEqual = Rx.internals.isEqual,
        defaultComparer = Rx.helpers.defaultComparer,
        identity = Rx.helpers.identity,
        subComparer = Rx.helpers.defaultSubComparer;

    // Defaults
    var argumentOutOfRange = 'Argument out of range';
    var sequenceContainsNoElements = "Sequence contains no elements.";
    