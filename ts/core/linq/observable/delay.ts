/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
module Rx {
    export interface Observable<T> {
        /**
        *  Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.
        *
        * @example
        *  1 - res = Rx.Observable.delay(new Date());
        *  2 - res = Rx.Observable.delay(new Date(), Rx.Scheduler.timeout);
        *
        *  3 - res = Rx.Observable.delay(5000);
        *  4 - res = Rx.Observable.delay(5000, 1000, Rx.Scheduler.timeout);
        * @memberOf Observable#
        * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
        * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} Time-shifted sequence.
        */
        delay(dueTime: Date, scheduler?: IScheduler): Observable<T>;
        /**
        *  Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.
        *
        * @example
        *  1 - res = Rx.Observable.delay(new Date());
        *  2 - res = Rx.Observable.delay(new Date(), Rx.Scheduler.timeout);
        *
        *  3 - res = Rx.Observable.delay(5000);
        *  4 - res = Rx.Observable.delay(5000, 1000, Rx.Scheduler.timeout);
        * @memberOf Observable#
        * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
        * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} Time-shifted sequence.
        */
        delay(dueTime: number, scheduler?: IScheduler): Observable<T>;
    }
}

(function () {
    var o: Rx.Observable<string>;
    o.delay(1000);
    o.delay(new Date());
    o.delay(1000, Rx.Scheduler.timeout);
    o.delay(new Date(), Rx.Scheduler.timeout);
});
