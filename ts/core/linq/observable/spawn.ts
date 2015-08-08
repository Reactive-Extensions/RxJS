/// <reference path="../../observable.ts"/>
module Rx {
    export interface ObservableStatic {
        spawn<T>(fn: () => T): Observable<T>;
    }
}
