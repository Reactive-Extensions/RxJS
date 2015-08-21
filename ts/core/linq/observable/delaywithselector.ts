/// <reference path="../../observable.ts" />
module Rx {
    export interface Observable<T> {
        /**
        *  Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.
        *
        * @example
        *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(5000); }); // with selector only
        *  1 - res = source.delayWithSelector(Rx.Observable.timer(2000), function (x) { return Rx.Observable.timer(x); }); // with delay and selector
        *
        * @param {Observable} [subscriptionDelay]  Sequence indicating the delay for the subscription to the source.
        * @param {Function} delayDurationSelector Selector function to retrieve a sequence indicating the delay for each given element.
        * @returns {Observable} Time-shifted sequence.
        */
        delayWithSelector(delayDurationSelector: (item: T) => ObservableOrPromise<number>): Observable<T>;

        /**
        *  Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.
        *
        * @example
        *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(5000); }); // with selector only
        *  1 - res = source.delayWithSelector(Rx.Observable.timer(2000), function (x) { return Rx.Observable.timer(x); }); // with delay and selector
        *
        * @param {Observable} [subscriptionDelay]  Sequence indicating the delay for the subscription to the source.
        * @param {Function} delayDurationSelector Selector function to retrieve a sequence indicating the delay for each given element.
        * @returns {Observable} Time-shifted sequence.
        */
        delayWithSelector(subscriptionDelay: Observable<number>, delayDurationSelector: (item: T) => ObservableOrPromise<number>): Observable<T>;
    }
}

(function() {
    var o: Rx.Observable<string>;

    o.delayWithSelector(x => Rx.Observable.timer(x.length));
    o.delayWithSelector(Rx.Observable.timer(1000), x => Rx.Observable.timer(x.length));
    o.delayWithSelector(x => Rx.Observable.timer(x.length).toPromise());
});
