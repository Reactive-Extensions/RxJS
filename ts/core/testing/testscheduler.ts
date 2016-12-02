/// <reference path="../concurrency/virtualtimescheduler.ts" />
/// <reference path="../observable.ts" />
/// <reference path="./recorded.ts" />
/// <reference path="./mockobserver.ts" />
module Rx {

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
         * @param settings.created Virtual time at which to invoke the factory to create an observable sequence.
         * @param settings.subscribed Virtual time at which to subscribe to the created observable sequence.
         * @param settings.disposed Virtual time at which to dispose the subscription.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */
        startScheduler<T>(create: () => Observable<T>, settings?: {created?: number, subscribed?: number, disposed?: number}): MockObserver<T>;
    }

    export var TestScheduler: {
        new (): TestScheduler;
    }
}

(function() {
    var ts : Rx.TestScheduler = new Rx.TestScheduler();

    var o : Rx.Observable<string> = ts.createColdObservable<string>(new Rx.Recorded(100, '5'));
    var o : Rx.Observable<string> = ts.createHotObservable<string>(new Rx.Recorded(100, '5'));
    var ob : Rx.MockObserver<boolean> = ts.createObserver<boolean>();

    var p : Rx.Promise<boolean> = ts.createResolvedPromise<boolean>(100, false);
    var p : Rx.Promise<boolean> = ts.createRejectedPromise<boolean>(100, false);

    var ob = ts.startScheduler<boolean>(() => Rx.Observable.create<boolean>(<any>null), {
        created: 100,
        subscribed: 200,
        disposed: 300
    });
    var ob = ts.startScheduler<boolean>(() => Rx.Observable.create<boolean>(<any>null), {
        disposed: 300
    });
    var ob = ts.startScheduler<boolean>(() => Rx.Observable.create<boolean>(<any>null));
});
