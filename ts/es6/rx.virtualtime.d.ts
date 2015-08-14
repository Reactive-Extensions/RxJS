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

    export module internals {
        export interface ScheduledItem<TTime> {
            scheduler: IScheduler;
            state: TTime;
            action: (scheduler: IScheduler, state: any) => IDisposable;
            dueTime: TTime;
            comparer: (x: TTime, y: TTime) => number;
            disposable: SingleAssignmentDisposable;

            invoke(): void;
            compareTo(other: ScheduledItem<TTime>): number;
            isCancelled(): boolean;
            invokeCore(): IDisposable;
        }

        interface ScheduledItemStatic {
            new <TTime>(scheduler: IScheduler, state: any, action: (scheduler: IScheduler, state: any) => IDisposable, dueTime: TTime, comparer?: _Comparer<TTime, number>):ScheduledItem<TTime>;
        }

        export var ScheduledItem: ScheduledItemStatic
    }

    export module internals {
        // Priority Queue for Scheduling
        export interface PriorityQueue<TTime> {
            length: number;

            isHigherPriority(left: number, right: number): boolean;
            percolate(index: number): void;
            heapify(index: number): void;
            peek(): ScheduledItem<TTime>;
            removeAt(index: number): void;
            dequeue(): ScheduledItem<TTime>;
            enqueue(item: ScheduledItem<TTime>): void;
            remove(item: ScheduledItem<TTime>): boolean;
        }

        interface PriorityQueueStatic {
                new <T>(capacity: number) : PriorityQueue<T>;
                count: number;
        }

        export var PriorityQueue : PriorityQueueStatic;
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

    export interface HistoricalScheduler extends VirtualTimeScheduler<number, number> {
    }

    export var HistoricalScheduler: {
        /**
         * Creates a new historical scheduler with the specified initial clock value.
         * @constructor
         * @param {Number} initialClock Initial value for the clock.
         * @param {Function} comparer Comparer to determine causality of events based on absolute time.
         */
        new (initialClock: number, comparer: _Comparer<number, number>): HistoricalScheduler;
    };

}

declare module "rx" { export = Rx; }

declare module "rx.virtualtime" { export = Rx; }
