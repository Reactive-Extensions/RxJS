/// <reference path="../../observable.ts" />
module Rx {
    export interface ObservableStatic {
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, resultSelector: (v1: T, v2: T2) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, resultSelector: (v1: T, v2: T2, v3: T3) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, T5, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, T5, T6, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, eventh: ObservableOrPromise<T7>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7, T8, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7, v8: T8) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7, T8, T9, TResult>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>, ninth: ObservableOrPromise<T9>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, v7: T7, v8: T8, v9: T9) => TResult): Observable<TResult>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
        */
        combineLatest<TOther, TResult>(sources: ObservableOrPromise<TOther>[], resultSelector: (...otherValues: TOther[]) => TResult): Observable<TResult>;

        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>): Observable<[T, T2]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>): Observable<[T, T2, T3]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>): Observable<[T, T2, T3, T4]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4, T5>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>): Observable<[T, T2, T3, T4, T5]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4, T5, T6>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>): Observable<[T, T2, T3, T4, T5, T6, T7]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7, T8>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>): Observable<[T, T2, T3, T4, T5, T6, T7, T8]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<T, T2, T3, T4, T5, T6, T7, T8, T9>(first: ObservableOrPromise<T>, second: ObservableOrPromise<T2>, third: ObservableOrPromise<T3>, fourth: ObservableOrPromise<T4>, fifth: ObservableOrPromise<T5>, sixth: ObservableOrPromise<T6>, seventh: ObservableOrPromise<T7>, eighth: ObservableOrPromise<T8>, ninth: ObservableOrPromise<T9>): Observable<[T, T2, T3, T4, T5, T6, T7, T8, T9]>;
        /**
        * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
        *
        * @example
        * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
        * @returns {Observable} An observable sequence containing a list of elements of the sources.
        */
        combineLatest<TOther>(sources: ObservableOrPromise<TOther>[]): Observable<TOther[]>;
    }
}

(function() {
    var o: Rx.Observable<boolean>;
    var io: Rx.IObservable<string>;
    var so: Rx.Subject<number>;
    var p: Rx.Promise<{ a: string }>;

    var r1: Rx.Observable<{ vo: boolean, vio: string, vp: { a: string }, vso: number }> = Rx.Observable.combineLatest(o, io, p, so, (vo, vio, vp, vso) => ({ vo, vio, vp, vso }));

    var r2: Rx.Observable<[boolean, string, { a: string }, number]> = Rx.Observable.combineLatest(o, io, p, so);

    var r3 : Rx.Observable<number> = Rx.Observable.combineLatest(<any[]>[o, io, so, p], (items) => 5);

    var r4: Rx.Observable<any[]> = Rx.Observable.combineLatest(<any[]>[o, io, so, p]);
});
