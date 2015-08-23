/// <reference path="../../observable.ts"/>
module Rx {
    export interface ObservableStatic {
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, TResult>(sources: ObservableOrPromise<T2>[], resultSelector?: (item1: T1, ...right: T2[]) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, TResult>(source1: ObservableOrPromise<T1>, ObservableOrPromise: Observable<T2>, resultSelector?: (item1: T1, item2: T2) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, resultSelector?: (item1: T1, item2: T2, item3: T3) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, TResult>(source1: Observable<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, T5, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, source5: ObservableOrPromise<T5>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, T5, T6, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, source5: ObservableOrPromise<T5>, source6: ObservableOrPromise<T6>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, T5, T6, T7, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, source5: ObservableOrPromise<T5>, source6: ObservableOrPromise<T6>, source7: ObservableOrPromise<T7>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, T5, T6, T7, T8, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, source5: ObservableOrPromise<T5>, source6: ObservableOrPromise<T6>, source7: ObservableOrPromise<T7>, source8: ObservableOrPromise<T8>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7, item8: T8) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
        * @param arguments Observable sources.
        * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        zip<T1, T2, T3, T4, T5, T6, T7, T8, T9, TResult>(source1: ObservableOrPromise<T1>, source2: ObservableOrPromise<T2>, source3: ObservableOrPromise<T3>, source4: ObservableOrPromise<T4>, source5: ObservableOrPromise<T5>, source6: ObservableOrPromise<T6>, source7: ObservableOrPromise<T7>, source8: ObservableOrPromise<T8>, source9: ObservableOrPromise<T9>, resultSelector?: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7, item8: T8, item9: T9) => TResult): Observable<TResult>;
    }
}
