declare module Rx {

    export interface ObservableStatic {
        wrap<T>(fn: Function): Observable<T>;
        spawn<T>(fn: Function): Observable<T>;
    }

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

}
declare module "rx.async" { export = Rx; }
