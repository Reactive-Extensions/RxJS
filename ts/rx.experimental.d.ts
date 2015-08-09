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
        *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
        *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
        *
        * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
        * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
        */
        let<TResult>(selector: (source: Observable<T>) => Observable<TResult>): Observable<TResult>;
    }

    export interface IScheduler {
        /**
        * Schedules an action to be executed.
        * @param {Function} action Action to execute.
        * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
        */
        schedule(action: () => void): IDisposable;

        /**
         * Schedules an action to be executed.
         * @param state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleWithState<TState>(state: TState, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;

        /**
         * Schedules an action to be executed after the specified relative due time.
         * @param {Function} action Action to execute.
         * @param {Number} dueTime Relative time after which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleWithRelative(dueTime: number, action: () => void): IDisposable;

        /**
         * Schedules an action to be executed after dueTime.
         * @param state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @param {Number} dueTime Relative time after which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleWithRelativeAndState<TState>(state: TState, dueTime: number, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;

        /**
         * Schedules an action to be executed at the specified absolute due time.
         * @param {Function} action Action to execute.
         * @param {Number} dueTime Absolute time at which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
          */
        scheduleRecursiveWithAbsolute(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;

        /**
         * Schedules an action to be executed at dueTime.
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @param {Number}dueTime Absolute time at which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;
    }

    export interface SchedulerStatic {
        new (
        now: () => number,
        schedule: (state: any, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable,
        scheduleRelative: (state: any, dueTime: number, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable,
        scheduleAbsolute: (state: any, dueTime: number, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable): Rx.IScheduler;

        /** Gets the current time according to the local machine's system clock. */
        now: number;

        /**
         * Normalizes the specified TimeSpan value to a positive value.
         * @param {Number} timeSpan The time span value to normalize.
         * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
         */
        normalize(timeSpan: number): number;
    }

    /** Provides a set of static properties to access commonly used schedulers. */
    export var Scheduler: SchedulerStatic;

    export interface ObservableStatic {
        /**
        *  Determines whether an observable collection contains values.
        *
        * @example
        *  1 - res = Rx.Observable.if(condition, obs1);
        *  2 - res = Rx.Observable.if(condition, obs1, obs2);
        *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
        * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
        * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
        * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
        * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
        */
        if<T>(condition: () => boolean, thenSource: ObservableOrPromise<T>, elseSourceOrScheduler?: ObservableOrPromise<T> | IScheduler): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
        * There is an alias for this method called 'forIn' for browsers <IE9
        * @param {Array} sources An array of values to turn into an observable sequence.
        * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
        * @returns {Observable} An observable sequence from the concatenated observable sequences.
        */
        for<T, TResult>(sources: T[], resultSelector: _Selector<T, TResult>, thisArg?: any): Observable<TResult>;
        /**
        *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
        * There is an alias for this method called 'forIn' for browsers <IE9
        * @param {Array} sources An array of values to turn into an observable sequence.
        * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
        * @returns {Observable} An observable sequence from the concatenated observable sequences.
        */
        forIn<T, TResult>(sources: T[], resultSelector: _Selector<T, TResult>, thisArg?: any): Observable<TResult>;
    }

    export interface ObservableStatic {
        /**
        *  Repeats source as long as condition holds emulating a while loop.
        * There is an alias for this method called 'whileDo' for browsers <IE9
        *
        * @param {Function} condition The condition which determines if the source will be repeated.
        * @param {Observable} source The observable sequence that will be run if the condition function returns true.
        * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
        */
        while<T>(condition: () => boolean, source: ObservableOrPromise<T>): Observable<T>;
        /**
        *  Repeats source as long as condition holds emulating a while loop.
        * There is an alias for this method called 'whileDo' for browsers <IE9
        *
        * @param {Function} condition The condition which determines if the source will be repeated.
        * @param {Observable} source The observable sequence that will be run if the condition function returns true.
        * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
        */
        whileDo<T>(condition: () => boolean, source: ObservableOrPromise<T>): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Repeats source as long as condition holds emulating a do while loop.
        *
        * @param {Function} condition The condition which determines if the source will be repeated.
        * @param {Observable} source The observable sequence that will be run if the condition function returns true.
        * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
        */
        doWhile(condition: () => boolean): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        *  Uses selector to determine which source in sources to use.
        * @param {Function} selector The function which extracts the value for to test in a case statement.
        * @param {Array} sources A object which has keys which correspond to the case statement labels.
        * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
        *
        * @returns {Observable} An observable sequence which is determined by a case statement.
        */
        case<T>(selector: () => string, sources: { [key: string]: ObservableOrPromise<T>; }, schedulerOrElseSource?: IScheduler | ObservableOrPromise<T>): Observable<T>;
        /**
        *  Uses selector to determine which source in sources to use.
        * @param {Function} selector The function which extracts the value for to test in a case statement.
        * @param {Array} sources A object which has keys which correspond to the case statement labels.
        * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
        *
        * @returns {Observable} An observable sequence which is determined by a case statement.
        */
        case<T>(selector: () => number, sources: { [key: number]: ObservableOrPromise<T>; }, schedulerOrElseSource?: IScheduler | ObservableOrPromise<T>): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Expands an observable sequence by recursively invoking selector.
        *
        * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
        * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
        * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
        */
        expand(selector: (item: T) => Observable<T>, scheduler?: IScheduler): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        *  Runs all observable sequences in parallel and collect their last elements.
        *
        * @example
        *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
        *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
        * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
        */
        forkJoin<T>(sources: ObservableOrPromise<T>[]): Observable<T[]>;

        /**
        *  Runs all observable sequences in parallel and collect their last elements.
        *
        * @example
        *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
        *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
        * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
        */
        forkJoin<T>(...args: ObservableOrPromise<T>[]): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Runs two observable sequences in parallel and combines their last elemenets.
        *
        * @param {Observable} second Second observable sequence.
        * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
        * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
        */
        forkJoin<TSecond, TResult>(second: ObservableOrPromise<TSecond>, resultSelector: (left: T, right: TSecond) => TResult): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        * Comonadic bind operator.
        * @param {Function} selector A transform function to apply to each element.
        * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
        * @returns {Observable} An observable sequence which results from the comonadic bind operation.
        */
        manySelect<TResult>(selector: _Selector<Observable<T>, TResult>, scheduler?: IScheduler): Observable<TResult>;
        /**
        * Comonadic bind operator.
        * @param {Function} selector A transform function to apply to each element.
        * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
        * @returns {Observable} An observable sequence which results from the comonadic bind operation.
        */
        extend<TResult>(selector: _Selector<Observable<T>, TResult>, scheduler?: IScheduler): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        * Performs a exclusive waiting for the first to finish before subscribing to another observable.
        * Observables that come in between subscriptions will be dropped on the floor.
        * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
        */
        switchFirst(): T;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        selectSwitchFirst<TResult>(selector: _ValueOrSelector<T, ObservableOrPromise<TResult>>): Observable<TResult>;
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        selectSwitchFirst<TResult>(selector: _ValueOrSelector<T, ArrayOrIterable<TResult>>): Observable<TResult>;
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        selectSwitchFirst<TOther, TResult>(selector: _ValueOrSelector<T, ObservableOrPromise<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        selectSwitchFirst<TOther, TResult>(selector: _ValueOrSelector<T, ArrayOrIterable<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;

        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        flatMapFirst<TResult>(selector: _ValueOrSelector<T, ObservableOrPromise<TResult>>): Observable<TResult>;

        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        flatMapFirst<TResult>(selector: _ValueOrSelector<T, ArrayOrIterable<TResult>>): Observable<TResult>;
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        flatMapFirst<TOther, TResult>(selector: _ValueOrSelector<T, ObservableOrPromise<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
        /**
        *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
        *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
        *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
        */
        flatMapFirst<TOther, TResult>(selector: _ValueOrSelector<T, ArrayOrIterable<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        selectManyWithMaxConcurrent<TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ObservableOrPromise<TResult>>): Observable<TResult>;
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        selectManyWithMaxConcurrent<TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ArrayOrIterable<TResult>>): Observable<TResult>;
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        selectManyWithMaxConcurrent<TOther, TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ObservableOrPromise<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        selectManyWithMaxConcurrent<TOther, TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ArrayOrIterable<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;

        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        flatMapWithMaxConcurrent<TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ObservableOrPromise<TResult>>): Observable<TResult>;

        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        flatMapWithMaxConcurrent<TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ArrayOrIterable<TResult>>): Observable<TResult>;
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        flatMapWithMaxConcurrent<TOther, TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ObservableOrPromise<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
        /**
        *  One of the Following:
        *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        * @example
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); });
        *  Or:
        *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        *  Or:
        *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        *
        *  var res = source.flatMapWithMaxConcurrent(5, Rx.Observable.fromArray([1,2,3]));
        * @param selector A transform function to apply to each element or an observable sequence to project each element from the
        * source sequence onto which could be either an observable or Promise.
        * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
        * @param {Any} [thisArg] Object to use as this when executing callback.
        * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
        */
        flatMapWithMaxConcurrent<TOther, TResult>(maxConcurrent: number, selector: _ValueOrSelector<T, ArrayOrIterable<TOther>>, resultSelector: special._FlatMapResultSelector<T, TOther, TResult>, thisArg?: any): Observable<TResult>;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.experimental" { export = Rx; }