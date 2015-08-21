/// <reference path="../../observable.ts"/>
/// <reference path="../../concurrency/scheduler.ts" />
module Rx {
    export interface Observable<T> {
        /**
        *  Returns the source observable sequence or the other observable sequence if dueTime elapses.
        * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
        * @param {Observable} [other]  Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
        * @param {Scheduler} [scheduler]  Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
        */
        timeout(dueTime: Date, other?: Observable<T>, scheduler?: IScheduler): Observable<T>;
        /**
        *  Returns the source observable sequence or the other observable sequence if dueTime elapses.
        * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
        * @param {Observable} [other]  Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
        * @param {Scheduler} [scheduler]  Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
        */
        timeout(dueTime: number, other?: Observable<T>, scheduler?: IScheduler): Observable<T>;
    }
}


(function () {
    var o: Rx.Observable<string>;
    o.timeout(100);
    o.timeout(new Date());
    o.timeout(100, o);
    o.timeout(new Date(), o);
    o.timeout(100, o, Rx.Scheduler.timeout);
    o.timeout(new Date(), o, Rx.Scheduler.timeout);
});
