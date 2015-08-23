
var inherits = require('../../internal/inherits'),
    bindCallback = require('../../internal/bindCallback'),
    isFunction = require('../../helpers/isFunction'),
    tryCatch = require('../../internal/tryCatch'),
    isPromise = require('../../helpers/isPromise'),
    isArrayLike = require('../../helpers/isArrayLike'),
    isIterable = require('../../helpers/isIterable'),
    ObservableBase = require('./ObservableBase'),
    from = require('../from'),
    fromPromise = require('../fromPromise');

var FlatMapObservable = (function(__super__){

    inherits(FlatMapObservable, __super__);

    function FlatMapObservable(source, selector, resultSelector, thisArg) {
        this.resultSelector = isFunction(resultSelector) ?
            resultSelector : null;

        this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
        this.source = source;

        __super__.call(this);

    }

    FlatMapObservable.prototype.subscribeCore = function(o) {
        return this.source.subscribe(new FlatMapObserver(o, this.selector, this.resultSelector, this));
    };

    function FlatMapObserver(observer, selector, resultSelector, source) {
        this.i = 0;
        this.selector = selector;
        this.resultSelector = resultSelector;
        this.source = source;
        this.isStopped = false;
        this.o = observer;
    }

    FlatMapObserver.prototype._wrapResult = function(result, x, i) {
        return this.resultSelector ?
            result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
            result;
    };

    FlatMapObserver.prototype.onNext = function(x) {

        if (this.isStopped) return;
        var i = this.i++;
        var result = tryCatch(this.selector)(x, i, this.source);

        if (result === errorObj) {
            return this.o.onError(result.e);
        }

        isPromise(result) && (result = fromPromise(result));
        (isArrayLike(result) || isIterable(result)) && (result = from(result));

        this.o.onNext(this._wrapResult(result, x, i));

    };

    FlatMapObserver.prototype.onError = function(e) {
        if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
    };

    FlatMapObserver.prototype.onCompleted = function() {
        if (!this.isStopped) {this.isStopped = true; this.o.onCompleted(); }
    };

    return FlatMapObservable;

}(ObservableBase));


module.exports = function(source, selector, resultSelector, thisArg) {
    return new FlatMapObservable(source, selector, resultSelector, thisArg);
};