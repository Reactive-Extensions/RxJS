observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
};

//Rx.Observable.prototype.flatMapFirst = function(selector, resultSelector, thisArg) {
//    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
//};
//
//Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
//    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
//};
//
//Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
//    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
//};
//
