declare module Rx {

    // Type alias for observables and promises
    export type ObservableOrPromise<T> = IObservable<T> | Promise<T>;

    export type ArrayLike<T> = Array<T> | { length: number;[index: number]: T; };

    // Type alias for arrays and array like objects
    export type ArrayOrIterable<T> = ArrayLike<T>;

    /**
     * Promise A+
     */
    export interface Promise<T> {
        then<R>(onFulfilled: (value: T) => R|Promise<R>, onRejected: (error: any) => Promise<R>): Promise<R>;
        then<R>(onFulfilled: (value: T) => R|Promise<R>, onRejected?: (error: any) => R): Promise<R>;
    }

    /**
     * Promise A+
     */
    export type IPromise<T> = Promise<T>;

    /**
    * Represents a push-style collection.
    */
    export interface IObservable<T> { }

    /**
    * Represents a push-style collection.
    */
    export interface Observable<T> { }

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
        *  Correlates the elements of two sequences based on overlapping durations.
        *
        *  @param {Observable} right The right observable sequence to join elements for.
        *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
        *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
        *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
        *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
        */
        join<TRight, TDurationLeft, TDurationRight, TResult>(
            right: Observable<TRight>,
            leftDurationSelector: (leftItem: T) => Observable<TDurationLeft>,
            rightDurationSelector: (rightItem: TRight) => Observable<TDurationRight>,
            resultSelector: (leftItem: T, rightItem: TRight) => TResult): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        *  Groups the elements of an observable sequence according to a specified key selector function.
        *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
        *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
        *
        * @example
        *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
        *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
        *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
        * @param {Function} keySelector A function to extract the key for each element.
        * @param {Function} durationSelector A function to signal the expiration of a group.
        * @returns {Observable}
        *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
        *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
        *
        */
        groupByUntil<TKey, TDuration>(keySelector: (value: T) => TKey, skipElementSelector: boolean, durationSelector: (group: GroupedObservable<TKey, T>) => Observable<TDuration>, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, T>>;

        /**
        *  Groups the elements of an observable sequence according to a specified key selector function.
        *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
        *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
        *
        * @example
        *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
        *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); 
    export interface Observable<T> {
        /**
        *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
        *
        *  @param {Observable} right The right observable sequence to join elements for.
        *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
        *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
        *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
        *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
        */
        groupJoin<TRight, TDurationLeft, TDurationRight, TResult>(
            right: Observable<TRight>,
            leftDurationSelector: (leftItem: T) => Observable<TDurationLeft>,
            rightDurationSelector: (rightItem: TRight) => Observable<TDurationRight>,
            resultSelector: (leftItem: T, rightItem: Observable<TRight>) => TResult): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more buffers.
        *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        buffer<TBufferOpening>(bufferOpenings: Observable<TBufferOpening>): Observable<T[]>;
        /**
        *  Projects each element of an observable sequence into zero or more buffers.
        *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        buffer<TBufferClosing>(bufferClosingSelector: () => Observable<TBufferClosing>): Observable<T[]>;
        /**
        *  Projects each element of an observable sequence into zero or more buffers.
        *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        buffer<TBufferOpening, TBufferClosing>(bufferOpenings: Observable<TBufferOpening>, bufferClosingSelector: () => Observable<TBufferClosing>): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more windows.
        *
        *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        window<TWindowOpening>(windowOpenings: Observable<TWindowOpening>): Observable<Observable<T>>;
        /**
        *  Projects each element of an observable sequence into zero or more windows.
        *
        *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        window<TWindowClosing>(windowClosingSelector: () => Observable<TWindowClosing>): Observable<Observable<T>>;
        /**
        *  Projects each element of an observable sequence into zero or more windows.
        *
        *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
        *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
        *  @returns {Observable} An observable sequence of windows.
        */
        window<TWindowOpening, TWindowClosing>(windowOpenings: Observable<TWindowOpening>, windowClosingSelector: () => Observable<TWindowClosing>): Observable<Observable<T>>;
    }

    export interface Observable<T> {
        /**
         * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
         * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
         * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
         * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
         */
        pairwise(): Observable<[T, T]>;
    }

    export interface Observable<T> {
        /**
         * Returns two observables which partition the observations of the source by the given function.
         * The first will trigger observations for those values for which the predicate returns true.
         * The second will trigger observations for those values where the predicate returns false.
         * The predicate is executed once for each subscribed observer.
         * Both also propagate all error observations arising from the source and each completes
         * when the source completes.
         * @param {Function} predicate
         *    The function to determine which output Observable will trigger a particular observation.
         * @returns {Array}
         *    An array of observables. The first triggers when the predicate returns true,
         *    and the second triggers when the predicate returns false.
        */
        partition(predicate: _Predicate<T>, thisArg?: any): [Observable<T>, Observable<T>];
    }

    export interface Observable<T> {
        /**
         *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
         *
         * @example
         *  var res = observable.groupBy(function (x) { return x.id; });
         *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
         *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
         * @param {Function} keySelector A function to extract the key for each element.
         * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
         * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
         */
        groupBy<TKey, TElement>(keySelector: (value: T) => TKey, skipElementSelector?: boolean, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, T>>;
        /**
         *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
         *
         * @example
         *  var res = observable.groupBy(function (x) { return x.id; });
         *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; 
    export interface GroupedObservable<TKey, TElement> extends Observable<TElement> {
        key: TKey;
        underlyingObservable: Observable<TElement>;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.coincidence" { export = Rx; }