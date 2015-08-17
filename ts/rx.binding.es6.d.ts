declare module Rx {

    export interface Observable<T> {
        /**
        * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
        * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
        * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
        */
        singleInstance(): Observable<T>;
    }

}
declare module "rx.binding" { export = Rx; }
