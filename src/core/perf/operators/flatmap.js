var FlatMapObservable = (function(__super__){

    inherits(FlatMapObservable, __super__);

    function FlatMapObservable(source, selector, resultSelector, thisArg) {
        this.resultSelector = Rx.helpers.isFunction(resultSelector) ?
            resultSelector : null;

        this.selector = Rx.internals.bindCallback(Rx.helpers.isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
        this.source = source;

        __super__.call(this);

    }

    FlatMapObservable.prototype.subscribeCore = function(o) {
        return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
    };

    function InnerObserver(observer, selector, resultSelector, source) {
        this.i = 0;
        this.selector = selector;
        this.resultSelector = resultSelector;
        this.source = source;
        this.isStopped = false;
        this.o = observer;
    }

    InnerObserver.prototype._wrapResult = function(result, x, i) {
        return this.resultSelector ?
            result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
            result;
    };

    InnerObserver.prototype.onNext = function(x) {

        if (this.isStopped) return;
        var i = this.i++;
        var result = tryCatch(this.selector)(x, i, this.source);

        if (result === errorObj) {
            return this.o.onError(result.e);
        }

        Rx.helpers.isPromise(result) && (result = Rx.Observable.fromPromise(result));
        (Rx.helpers.isArrayLike(result) || Rx.helpers.isIterable(result)) && (result = Rx.Observable.from(result));

        this.o.onNext(this._wrapResult(result, x, i));

    };

    InnerObserver.prototype.onError = function(e) {
        if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
    };

    InnerObserver.prototype.onCompleted = function() {
        if (!this.isStopped) {this.isStopped = true; this.o.onCompleted(); }
    };

    return FlatMapObservable;

}(ObservableBase));


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
//Rx.Observable.prototype.flatMapConcat = function(selector, resultSelector, thisArg) {
//    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(1);
//};