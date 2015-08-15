declare module Rx {

    export interface ControlledObservable<T> {
        /**
         * Attaches a stop and wait observable to the current observable.
         * @returns {Observable} A stop and wait observable.
         */
        stopAndWait(): Observable<T>;
    }

    export interface ControlledObservable<T> {
        /**
         * Creates a sliding windowed observable based upon the window size.
         * @param {Number} windowSize The number of items in the window
         * @returns {Observable} A windowed observable based upon the window size.
         */
        windowed(windowSize: number): Observable<T>;
    }

}
declare module "rx.backpressure" { export = Rx; }
