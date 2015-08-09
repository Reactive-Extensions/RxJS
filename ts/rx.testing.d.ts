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

    export interface Subscription {
        /**
         * Checks whether the given subscription is equal to the current instance.
         * @param other Subscription object to check for equality.
         * @returns {Boolean} true if both objects are equal; false otherwise.
         */
        equals(other: Subscription): boolean;
        /**
         * Returns a string representation of the current Subscription value.
         * @returns {String} String representation of the current Subscription value.
         */
        toString(): string;
    }

    interface SubscriptionStatic {
        /**
         * Creates a new subscription object with the given virtual subscription and unsubscription time.
         *
         * @constructor
         * @param {Number} subscribe Virtual time at which the subscription occurred.
         * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
         */
        new (subscribeAt: number, unsubscribeAt?: number);
    }

    export var Subscription: SubscriptionStatic;

    export interface Recorded {
        /**
         * Checks whether the given recorded object is equal to the current instance.
         *
         * @param {Recorded} other Recorded object to check for equality.
         * @returns {Boolean} true if both objects are equal; false otherwise.
         */
        equals(other: Recorded): boolean;
        /**
         * Returns a string representation of the current Recorded value.
         *
         * @returns {String} String representation of the current Recorded value.
         */
        toString(): string;
        time: number;
        value: any;
    }

    interface RecordedStatic {
        /**
         * Creates a new object recording the production of the specified value at the given virtual time.
         *
         * @constructor
         * @param {Number} time Virtual time the value was produced on.
         * @param {Mixed} value Value that was produced.
         * @param {Function} comparer An optional comparer.
         */
        new (time: number, value: any, equalityComparer?: _Comparer<any, boolean>): Recorded;
    }

    export var Recorded: RecordedStatic;

    export var ReactiveTest: {
        /** Default virtual time used for creation of observable sequences in unit tests. */
        created: number;
        /** Default virtual time used to subscribe to observable sequences in unit tests. */
        subscribed: number;
        /** Default virtual time used to dispose subscriptions in unit tests. */
        disposed: number;

        /**
         * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
         *
         * 1 - ReactiveTest.onNext(200, 42);
         * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
         *
         * @param ticks Recorded virtual time the OnNext notification occurs.
         * @param value Recorded value stored in the OnNext notification or a predicate.
         * @return Recorded OnNext notification.
         */
        onNext(ticks: number, value: any): Recorded;
        /**
         * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
         *
         * 1 - ReactiveTest.onNext(200, 42);
         * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
         *
         * @param ticks Recorded virtual time the OnNext notification occurs.
         * @param value Recorded value stored in the OnNext notification or a predicate.
         * @return Recorded OnNext notification.
         */
        onNext(ticks: number, predicate: (value: any) => boolean): Recorded;
        /**
         * Factory method for an OnError notification record at a given time with a given error.
         *
         * 1 - ReactiveTest.onNext(200, new Error('error'));
         * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
         *
         * @param ticks Recorded virtual time the OnError notification occurs.
         * @param exception Recorded exception stored in the OnError notification.
         * @return Recorded OnError notification.
         */
        onError(ticks: number, exception: any): Recorded;
        /**
         * Factory method for an OnError notification record at a given time with a given error.
         *
         * 1 - ReactiveTest.onNext(200, new Error('error'));
         * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
         *
         * @param ticks Recorded virtual time the OnError notification occurs.
         * @param exception Recorded exception stored in the OnError notification.
         * @return Recorded OnError notification.
         */
        onError(ticks: number, predicate: (exception: any) => boolean): Recorded;
        /**
         * Factory method for an OnCompleted notification record at a given time.
         *
         * @param ticks Recorded virtual time the OnCompleted notification occurs.
         * @return Recorded OnCompleted notification.
         */
        onCompleted(ticks: number): Recorded;

        /**
         * Factory method for a subscription record based on a given subscription and disposal time.
         *
         * @param start Virtual time indicating when the subscription was created.
         * @param end Virtual time indicating when the subscription was disposed.
         * @return Subscription object.
         */
        subscribe(subscribeAt: number, unsubscribeAt?: number): Subscription;
    }

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

    export interface MockObserver<T> extends Observer<T> {
        messages: Recorded[];
    }

    interface MockObserverStatic extends ObserverStatic {
        new <T>(scheduler: IScheduler): MockObserver<T>;
    }

    export var MockObserver: MockObserverStatic;

    export interface VirtualTimeScheduler<TAbsolute, TRelative> extends IScheduler {
        /**
         * Adds a relative time value to an absolute time value.
         * @param {Number} absolute Absolute virtual time value.
         * @param {Number} relative Relative virtual time value to add.
         * @return {Number} Resulting absolute virtual time sum value.
         */
        add(from: TAbsolute, by: TRelative): TAbsolute;

        /**
         * Converts an absolute time to a number
         * @param {Any} The absolute time.
         * @returns {Number} The absolute time in ms
         */
        toDateTimeOffset(duetime: TAbsolute): number;

        /**
         * Converts the TimeSpan value to a relative virtual time value.
         * @param {Number} timeSpan TimeSpan value to convert.
         * @return {Number} Corresponding relative virtual time value.
         */
        toRelative(duetime: number): TRelative;

        /**
         * Starts the virtual time scheduler.
         */
        start(): IDisposable;

        /**
         * Stops the virtual time scheduler.
         */
        stop(): void;

        /**
         * Advances the scheduler's clock to the specified time, running all work till that point.
         * @param {Number} time Absolute time to advance the scheduler's clock to.
         */
        advanceTo(time: TAbsolute): void;

        /**
         * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
         * @param {Number} time Relative time to advance the scheduler's clock by.
         */
        advanceBy(time: TRelative): void;

        /**
         * Advances the scheduler's clock by the specified relative time.
         * @param {Number} time Relative time to advance the scheduler's clock by.
         */
        sleep(time: TRelative): void;

        isEnabled: boolean;

        /**
         * Gets the next scheduled item to be executed.
         * @returns {ScheduledItem} The next scheduled item.
         */
        getNext(): internals.ScheduledItem<TAbsolute>;
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


    export interface TestScheduler extends VirtualTimeScheduler<number, number> {
        /**
         * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
         * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
         * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
         */
        createColdObservable<T>(...records: Recorded[]): Observable<T>;
        /**
         * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
         * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
         * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
         */
        createHotObservable<T>(...records: Recorded[]): Observable<T>;
        /**
         * Creates an observer that records received notification messages and timestamps those.
         * @return Observer that can be used to assert the timing of received notifications.
         */
        createObserver<T>(): MockObserver<T>;

        /**
         * Creates a resolved promise with the given value and ticks
         * @param {Number} ticks The absolute time of the resolution.
         * @param {Any} value The value to yield at the given tick.
         * @returns {MockPromise} A mock Promise which fulfills with the given value.
         */
        createResolvedPromise<T>(ticks: number, value: T): IPromise<T>;
        /**
         * Creates a rejected promise with the given reason and ticks
         * @param {Number} ticks The absolute time of the resolution.
         * @param {Any} reason The reason for rejection to yield at the given tick.
         * @returns {MockPromise} A mock Promise which rejects with the given reason.
         */
        createRejectedPromise<T>(ticks: number, value: T): IPromise<T>;

        /**
         * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
         *
         * @param create Factory method to create an observable sequence.
         * @param created Virtual time at which to invoke the factory to create an observable sequence.
         * @param subscribed Virtual time at which to subscribe to the created observable sequence.
         * @param disposed Virtual time at which to dispose the subscription.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */
        startWithTiming<T>(create: () => Observable<T>, createdAt: number, subscribedAt: number, disposedAt: number): MockObserver<T>;
        /**
         * Starts the test scheduler and uses the specified virtual time to dispose the subscription to the sequence obtained through the factory function.
         * Default virtual times are used for factory invocation and sequence subscription.
         *
         * @param create Factory method to create an observable sequence.
         * @param disposed Virtual time at which to dispose the subscription.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */
        startWithDispose<T>(create: () => Observable<T>, disposedAt: number): MockObserver<T>;
        /**
         * Starts the test scheduler and uses default virtual times to invoke the factory function, to subscribe to the resulting sequence, and to dispose the subscription.
         *
         * @param create Factory method to create an observable sequence.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */
        startWithCreate<T>(create: () => Observable<T>): MockObserver<T>;
    }

    export var TestScheduler: {
        new (): TestScheduler;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.testing" { export = Rx; }