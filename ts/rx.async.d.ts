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

    export interface ObservableStatic {
        spawn<T>(fn: () => T): Observable<T>;
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
        * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
        *
        * @example
        * var res = Rx.Observable.start(function () { console.log('hello'); });
        * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
        * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
        *
        * @param {Function} func Function to run asynchronously.
        * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
        *
        * Remarks
        * * The function is called immediately, not during the subscription of the resulting sequence.
        * * Multiple subscriptions to the resulting sequence can observe the function's result.
        */
        start<T>(func: () => T, scheduler?: IScheduler, context?: any): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        * @param {Function} function Function to convert to an asynchronous function.
        * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Function} Asynchronous function.
        */
        toAsync<TResult>(func: () => TResult, context?: any, scheduler?: IScheduler): () => Observable<TResult>;
        /**
        * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        * @param {Function} function Function to convert to an asynchronous function.
        * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Function} Asynchronous function.
        */
        toAsync<T1, TResult>(func: (arg1: T1) => TResult, context?: any, scheduler?: IScheduler): (arg1: T1) => Observable<TResult>;
        /**
        * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        * @param {Function} function Function to convert to an asynchronous function.
        * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Function} Asynchronous function.
        */
        toAsync<T1, T2, TResult>(func: (arg1: T1, arg2: T2) => TResult, context?: any, scheduler?: IScheduler): (arg1: T1, arg2: T2) => Observable<TResult>;
        /**
        * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        * @param {Function} function Function to convert to an asynchronous function.
        * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Function} Asynchronous function.
        */
        toAsync<T1, T2, T3, TResult>(func: (arg1: T1, arg2: T2, arg3: T3) => TResult, context?: any, scheduler?: IScheduler): (arg1: T1, arg2: T2, arg3: T3) => Observable<TResult>;
        /**
        * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        * @param {Function} function Function to convert to an asynchronous function.
        * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
        * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
        * @returns {Function} Asynchronous function.
        */
        toAsync<T1, T2, T3, T4, TResult>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => TResult, context?: any, scheduler?: IScheduler): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Observable<TResult>;
    }

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

    export interface ObservableStatic {
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult>(func: Function, context: any, selector: Function): (...args: any[]) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1>(func: (arg1: T1, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2>(func: (arg1: T1, arg2: T2, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3>(func: (arg1: T1, arg2: T2, arg3: T3, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4, T5>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4, T5, T6>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4, T5, T6, T7>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4, T5, T6, T7, T8>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8) => Observable<TResult>;
        /**
         * Converts a callback function to an observable sequence.
         *
         * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
         * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
         */
        fromCallback<TResult, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, callback: (result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9) => Observable<TResult>;
    }

    export interface ObservableStatic {
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult>(func: Function, context: any, selector: Function): (...args: any[]) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1>(func: (arg1: T1, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2>(func: (arg1: T1, arg2: T2, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3>(func: (arg1: T1, arg2: T2, arg3: T3, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4, T5>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4, T5, T6>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4, T5, T6, T7>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4, T5, T6, T7, T8>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8) => Observable<TResult>;
        /**
         * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
         * @param {Function} func The function to call
         * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
         * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
         * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
         */
        fromNodeCallback<TResult, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, callback: (err: any, result: TResult) => any) => any, context?: any, selector?: Function): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9) => Observable<TResult>;
    }

    export interface ObservableStatic {
        /**
         * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
         * @param {Object} element The DOMElement or NodeList to attach a listener.
         * @param {String} eventName The event name to attach the observable sequence.
         * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
         * @returns {Observable} An observable sequence of events from the specified element and the specified event.
         */
        fromEvent<T>(element: NodeList, eventName: string, selector?: (arguments: any[]) => T): Observable<T>;
        /**
         * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
         * @param {Object} element The DOMElement or NodeList to attach a listener.
         * @param {String} eventName The event name to attach the observable sequence.
         * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
         * @returns {Observable} An observable sequence of events from the specified element and the specified event.
         */
        fromEvent<T>(element: Node, eventName: string, selector?: (arguments: any[]) => T): Observable<T>;
        /**
         * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
         * @param {Object} element The DOMElement or NodeList to attach a listener.
         * @param {String} eventName The event name to attach the observable sequence.
         * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
         * @returns {Observable} An observable sequence of events from the specified element and the specified event.
         */
        fromEvent<T>(element: { on: (name: string, cb: (e: any) => any) => void; off: (name: string, cb: (e: any) => any) => void }, eventName: string, selector?: (arguments: any[]) => T): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
        * @param {Function} addHandler The function to add a handler to the emitter.
        * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
        * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
        * @returns {Observable} An observable sequence which wraps an event from an event emitter
        */
        fromEventPattern<T>(addHandler: (handler: Function) => void, removeHandler: (handler: Function) => void, selector?: (arguments: any[]) => T): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        * Invokes the asynchronous function, surfacing the result through an observable sequence.
        * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
        * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
        */
        startAsync<T>(functionAsync: () => IPromise<T>): Observable<T>;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.async" { export = Rx; }