observableProto.flatMapConcat = observableProto.concatMap = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(1);
};