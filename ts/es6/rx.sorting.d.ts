declare module Rx {

    // Type alias for observables and promises
    export type ObservableOrPromise<T> = IObservable<T> | Observable<T> | Promise<T>;

    export type ArrayLike<T> = Array<T> | { length: number;[index: number]: T; };

    // Type alias for arrays and array like objects
    export type ArrayOrIterable<T> = ArrayLike<T> | Iterable<T>;

    /**
     * Promise A+
     */
    export type Promise<T> = PromiseLike<T>;

    /**
     * Promise A+
     */
    export type IPromise<T> = PromiseLike<T>;

    /**
    * Represents a push-style collection.
    */
    export interface IObservable<T> {}

    /**
    * Represents a push-style collection.
    */
    export interface Observable<T> extends IObservable<T> {}

    export module config {
        export var Promise: { new <T>(resolver: (resolvePromise: (value: T) => void, rejectPromise: (reason: any) => void) => void): IPromise<T>; };
    }

    export module helpers {
        export var noop: () => void;
        export var notDefined: (value: any) => boolean;
        export var identity: <T>(value: T) => T;
        export var defaultNow: () => number;
        export var defaultComparer: (left: any, right: any) =>  boolean;
        export var defaultSubComparer: (left: any, right: any) =>  number;
        export var defaultKeySerializer: (key: any) =>  string;
        export var defaultError: (err: any) =>  void;
        export var isPromise: (p: any) =>  boolean;
        export var asArray: <T>(...args: T[]) =>  T[];
        export var not: (value: any) =>  boolean;
        export var isFunction: (value: any) =>  boolean;
    }

    export type _Selector<T, TResult> = (value: T, index: number, observable: Observable<T>) => TResult;
    export type _ValueOrSelector<T, TResult> = TResult | _Selector<T, TResult>;
    export type _Predicate<T> = _Selector<T, boolean>;
    export type _Comparer<T, TResult> = (value1: T, value2: T) => TResult;
    export type _Accumulator<T, TAcc> = (acc: TAcc, value: T) => TAcc;

    export module special {
        export type _FlatMapResultSelector<T1, T2, TResult> = (value: T1, selectorValue: T2, index: number, selectorOther: number) => TResult;
    }

    export interface IObservable<T> {
        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribe(observer: IObserver<T>): IDisposable;
        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribe(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): IDisposable;
    }

    export interface Observable<T> {
        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribe(observer: IObserver<T>): IDisposable;
        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribe(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): IDisposable;

        /**
        * Subscribes to the next value in the sequence with an optional "this" argument.
        * @param {Function} onNext The function to invoke on each element in the observable sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribeOnNext(onNext: (value: T) => void, thisArg?: any): IDisposable;
        /**
        * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
        * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribeOnError(onError: (exception: any) => void, thisArg?: any): IDisposable;
        /**
        * Subscribes to the next value in the sequence with an optional "this" argument.
        * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
        */
        subscribeOnCompleted(onCompleted: () => void, thisArg?: any): IDisposable;

        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        forEach(observer: IObserver<T>): IDisposable;

        /**
        *  Subscribes an o to the observable sequence.
        *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
        *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
        *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
        *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
        */
        forEach(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): IDisposable;
    }

    export interface ObservableStatic {
        /**
        * Determines whether the given object is an Observable
        * @param {Any} An object to determine whether it is an Observable
        * @returns {Boolean} true if an Observable, else false.
        */
        isObservable(o: any): boolean;
    }

    export var Observable: ObservableStatic;

    export interface Observable<T> {
        /**
        * jortSort checks if your inputs are sorted.  Note that this is only for a sequence with an end.
        * See http://jort.technology/ for full details.
        * @returns {Observable} An observable which has a single value of true if sorted, else false.
        */
        jortSort(): Observable<boolean>;
    }

    export interface Observable<T> {
        /**
        * jortSort checks if your inputs are sorted until another Observable sequence fires.
        * See http://jort.technology/ for full details.
        * @returns {Observable} An observable which has a single value of true if sorted, else false.
        */
        jortSortUntil<TOther>(other: TOther): Observable<boolean>;
    }

}

declare module "rx" { export = Rx; }

declare module "rx.sorting" { export = Rx; }
