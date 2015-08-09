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

    /**
    * Supports push-style iteration over an observable sequence.
    */
    export interface IObserver<T> {
        /**
        * Notifies the observer of a new element in the sequence.
        * @param {Any} value Next element in the sequence.
        */
        onNext(value: T): void;
        /**
        * Notifies the observer that an exception has occurred.
        * @param {Any} error The error that has occurred.
        */
        onError(exception: any): void;
        /**
        * Notifies the observer of the end of the sequence.
        */
        onCompleted(): void;
    }
    
    export interface Observer<T> {
        /**
        * Notifies the observer of a new element in the sequence.
        * @param {Any} value Next element in the sequence.
        */
        onNext(value: T): void;
        /**
        * Notifies the observer that an exception has occurred.
        * @param {Any} error The error that has occurred.
        */
        onError(exception: any): void;
        /**
        * Notifies the observer of the end of the sequence.
        */
        onCompleted(): void;
    }

    export interface ObserverStatic {
        /**
        *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
        * @param {Function} [onNext] Observer's OnNext action implementation.
        * @param {Function} [onError] Observer's OnError action implementation.
        * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
        * @returns {Observer} The observer object implemented using the given actions.
        */
        create<T>(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): Observer<T>;
    }

    /**
    * Supports push-style iteration over an observable sequence.
    */
    export var Observer: ObserverStatic;

    export interface CheckedObserver<T> extends Observer<T> {
        checkAccess(): void;
    }

    export interface IDisposable {
        dispose(): void;
    }

    export interface Disposable extends IDisposable {
        /** Is this value disposed. */
        isDisposed?: boolean;
    }

    interface DisposableStatic {
        /**
         * Provides a set of static methods for creating Disposables.
         * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
         */
        new (action: () => void): Disposable;

        /**
         * Creates a disposable object that invokes the specified action when disposed.
         * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
         * @return {Disposable} The disposable object that runs the given action upon disposal.
         */
        create(action: () => void): Disposable;

        /**
         * Gets the disposable that does nothing when disposed.
         */
        empty: IDisposable;

        /**
         * Validates whether the given object is a disposable
         * @param {Object} Object to test whether it has a dispose method
         * @returns {Boolean} true if a disposable object, else false.
         */
        isDisposable(d: any): boolean;
    }

    /**
     * Provides a set of static methods for creating Disposables.
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    export var Disposable: DisposableStatic;

    /**
     *  Represents a notification to an observer.
     */
    export interface Notification<T> {
        /**
         * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
         *
         * @memberOf Notification
         * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
         * @param {Function} onError Delegate to invoke for an OnError notification.
         * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
         * @returns {Any} Result produced by the observation.
         */
        accept(observer: IObserver<T>): void;
        /**
         * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
         *
         * @memberOf Notification
         * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
         * @param {Function} onError Delegate to invoke for an OnError notification.
         * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
         * @returns {Any} Result produced by the observation.
         */
        accept<TResult>(onNext: (value: T) => TResult, onError?: (exception: any) => TResult, onCompleted?: () => TResult): TResult;

        /**
         * Returns an observable sequence with a single notification.
         *
         * @memberOf Notifications
         * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
         * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
         */
        toObservable(scheduler?: IScheduler): Observable<T>;

        hasValue: boolean;
        equals(other: Notification<T>): boolean;
        kind: string;
        value: T;
        exception: any;
    }

    interface NotificationStatic {
        new <T>(kind, value, exception, accept, acceptObservable, toString) : Notification<T>;

        /**
        * Creates an object that represents an OnNext notification to an observer.
        * @param {Any} value The value contained in the notification.
        * @returns {Notification} The OnNext notification containing the value.
        */
        createOnNext<T>(value: T): Notification<T>;
        /**
        * Creates an object that represents an OnError notification to an observer.
        * @param {Any} error The exception contained in the notification.
        * @returns {Notification} The OnError notification containing the exception.
        */
        createOnError<T>(exception: any): Notification<T>;
        /**
        * Creates an object that represents an OnCompleted notification to an observer.
        * @returns {Notification} The OnCompleted notification.
        */
        createOnCompleted<T>(): Notification<T>;
    }

    export var Notification : NotificationStatic;

	export interface Observer<T> {
        /**
        *  Creates a notification callback from an observer.
        * @returns The action that forwards its input notification to the underlying observer.
        */
		toNotifier(): (notification: Notification<T>) => void;

        /**
        *  Hides the identity of an observer.
        * @returns An observer that hides the identity of the specified observer.
        */
		asObserver(): Observer<T>;

        /**
        *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
        *  If a violation is detected, an Error is thrown from the offending observer method call.
        * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
        */
        checked(): CheckedObserver<T>;

        /**
        * Schedules the invocation of observer methods on the given scheduler.
        * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
        * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
        */
        notifyOn(scheduler: IScheduler): Observer<T>;
	}

	export interface ObserverStatic {
        /**
        *  Creates an observer from a notification callback.
        *
        * @static
        * @memberOf Observer
        * @param {Function} handler Action that handles a notification.
        * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
        */
		fromNotifier<T>(handler: (notification: Notification<T>, thisArg?: any) => void): Observer<T>;
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

    export interface Observable<T> {
        /**
        *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
        *
        *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
        *  that require to be run on a scheduler, use subscribeOn.
        *
        *  @param {Scheduler} scheduler Scheduler to notify observers on.
        *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
        */
        observeOn(scheduler: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
        *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

        *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
        *  callbacks on a scheduler, use observeOn.

        *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
        *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
        */
        subscribeOn(scheduler: IScheduler): Observable<T>;
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
         *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
         *
         * @example
         *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
         *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
         * @param {Mixed} initialState Initial state.
         * @param {Function} condition Condition to terminate generation (upon returning false).
         * @param {Function} iterate Iteration step function.
         * @param {Function} resultSelector Selector function for results produced in the sequence.
         * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
         * @returns {Observable} The generated sequence.
         */
        generate<TState, TResult>(initialState: TState, condition: (state: TState) => boolean, iterate: (state: TState) => TState, resultSelector: (state: TState) => TResult, scheduler?: IScheduler): Observable<TResult>;
    }

    export interface ObservableStatic {
        /**
         * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
         * @param {Function} resourceFactory Factory function to obtain a resource object.
         * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
         * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
         */
        using<TSource, TResource extends IDisposable>(resourceFactory: () => TResource, observableFactory: (resource: TResource) => Observable<TSource>): Observable<TSource>;
    }

    export interface Observable<T> {
        /**
        * Propagates the observable sequence or Promise that reacts first.
        * @param {Observable} rightSource Second observable sequence or Promise.
        * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
        */
        amb(observable: ObservableOrPromise<T>): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        * Propagates the observable sequence or Promise that reacts first.
        * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
        */
        amb<T>(observables: ObservableOrPromise<T>[]): Observable<T>;
        /**
        * Propagates the observable sequence or Promise that reacts first.
        * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
        */
        amb<T>(...observables: ObservableOrPromise<T>[]): Observable<T>;
    }

    export interface Observable<T> {
        /**
        * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
        * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
        */
        onErrorResumeNext(second: ObservableOrPromise<T>): Observable<T>;
    }

    export interface ObservableStatic {
        /**
        * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        *
        * @example
        * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
        * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
        * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
        */
        onErrorResumeNext<T>(...sources: ObservableOrPromise<T>[]): Observable<T>;
        /**
        * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        *
        * @example
        * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
        * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
        * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
        */
        onErrorResumeNext<T>(sources: ObservableOrPromise<T>[]): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
        * @param {Number} count Length of each buffer.
        * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
        * @returns {Observable} An observable sequence of buffers.
        */
        bufferWithCount(count: number, skip?: number): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
        *
        *  var res = xs.windowWithCount(10);
        *  var res = xs.windowWithCount(10, 1);
        * @param {Number} count Length of each window.
        * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
        * @returns {Observable} An observable sequence of windows.
        */
        windowWithCount(count: number, skip?: number): Observable<Observable<T>>;
    }

    export interface Observable<T> {
        /**
        *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
        *
        * @description
        *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
        *  source sequence, this buffer is produced on the result sequence.
        * @param {Number} count Number of elements to take from the end of the source sequence.
        * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
        */
        takeLastBuffer(count: number): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
        *
        *  var res = obs = xs.defaultIfEmpty();
        *  2 - obs = xs.defaultIfEmpty(false);
        *
        * @memberOf Observable#
        * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
        * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
        */
        defaultIfEmpty(defaultValue?: T): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
        *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
        *
        * @example
        *  var res = obs = xs.distinct();
        *  2 - obs = xs.distinct(function (x) { return x.id; });
        *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
        * @param {Function} [keySelector]  A function to compute the comparison key for each element.
        * @param {Function} [comparer]  Used to compare items in the collection.
        * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
        */
        distinct<TKey>(keySelector?: (value: T) => TKey, keySerializer?: (key: TKey) => string): Observable<T>;
    }

    export interface Observable<T> {
        /**
        * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
        * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
        * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
        */
        singleInstance(): Observable<T>;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.lite.extras" { export = Rx; }