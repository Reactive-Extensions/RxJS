/// <reference path="../../observable.ts"/>
module Rx {
    export interface Observable<T> {
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, TResult>(second: ObservableOrPromise<T2>, resultSelector?: (v1: T, v2: T2) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, resultSelector?: (v1: T, v2: T2, v3: T3) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, T5, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, T5, T6, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, T5, T6, T7, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, T5, T6, T7, T8, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7, v8: T8) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<T2, T3, T4, T5, T6, T7, T8, T9, TResult>(second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>, ninth: ObservableOrPromise<T9>, resultSelector?: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7, v8: T8, v9: T9) => TResult): Observable<TResult>;
        /**
         * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
         * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
         * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
         */
        zip<TOther, TResult>(souces: ObservableOrPromise<TOther>[], resultSelector?: (firstValue: T, ...otherValues: TOther[]) => TResult): Observable<TResult>;
    }
}
