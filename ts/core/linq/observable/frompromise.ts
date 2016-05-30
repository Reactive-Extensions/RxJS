/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
module Rx {
    export interface ObservableStatic {
        /**
        * Converts a Promise to an Observable sequence
        * @param {Promise} An ES6 Compliant promise.
        * @param {Scheduler} [scheduler] Scheduler to run the conversion from Promises to Observable on. Defaults to Scheduler.async if not provided.
        * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
        */
        fromPromise<T>(promise: Promise<T>, scheduler?: IScheduler): Observable<T>;
    }
}

(function () {
    var p : Rx.Promise<string>;
    var o : Rx.Observable<string> = Rx.Observable.fromPromise(p);
})
