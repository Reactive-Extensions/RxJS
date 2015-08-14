/// <reference path="../../observable.ts" />
module Rx {
    export interface Observable<T> {
        /**
        * Ignores values from an observable sequence which are followed by another value within a computed throttle duration.
        * @param {Function} durationSelector Selector function to retrieve a sequence indicating the throttle duration for each given element.
        * @returns {Observable} The debounced sequence.
        */
        debounceWithSelector(debounceDurationSelector: (item: T) => ObservableOrPromise<number>): Observable<T>;
    }
}

(function () {
    var o: Rx.Observable<string>;
    o.debounceWithSelector(x => Rx.Observable.just(x.length));
});
