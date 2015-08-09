/// <reference path="./es6-iterable.d.ts" />
/// <reference path="./es6-promise.d.ts" />
module Rx {
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
}
