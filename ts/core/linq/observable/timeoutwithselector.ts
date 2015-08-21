/// <reference path="../../observable.ts"/>
module Rx {
    export interface Observable<T> {
        /**
        *  Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.
        * @param {Observable} [firstTimeout]  Observable sequence that represents the timeout for the first element. If not provided, this defaults to Observable.never().
        * @param {Function} timeoutDurationSelector Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
        * @param {Observable} [other]  Sequence to return in case of a timeout. If not provided, this is set to Observable.throwException().
        * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
        */
        timeoutWithSelector<TTimeout>(firstTimeout: Observable<TTimeout>, timeoutdurationSelector?: (item: T) => Observable<TTimeout>, other?: Observable<T>): Observable<T>;
    }
}

(function () {
    var o: Rx.Observable<string>;
    o.timeoutWithSelector(Rx.Observable.interval(1000));
    o.timeoutWithSelector(Rx.Observable.interval(1000), x => Rx.Observable.interval(1000));
    o.timeoutWithSelector(Rx.Observable.interval(1000), x => Rx.Observable.interval(1000), Rx.Observable.just('100'));
});
