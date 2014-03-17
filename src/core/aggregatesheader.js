    // References
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        CompositeDisposable = Rx.CompositeDisposable,
        AnonymousObservable = Rx.AnonymousObservable,
        isEqual = Rx.internals.isEqual;

    // Defaults
    var argumentOutOfRange = 'Argument out of range';
    var sequenceContainsNoElements = "Sequence contains no elements.";
    function defaultComparer(x, y) { return isEqual(x, y); }
    function identity(x) { return x; }
    function subComparer(x, y) {
        if (x > y) {
            return 1;
        }
        if (x < y) {
            return -1
        }
        return 0;
    }
    