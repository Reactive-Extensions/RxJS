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

    export class Plan<T> { }

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

    export interface Pattern2<T1, T2> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T3>(other: Observable<T3>): Pattern3<T1, T2, T3>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2) => TR): Plan<TR>;
    }
    interface Pattern3<T1, T2, T3> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T4>(other: Observable<T4>): Pattern4<T1, T2, T3, T4>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3) => TR): Plan<TR>;
    }
    interface Pattern4<T1, T2, T3, T4> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T5>(other: Observable<T5>): Pattern5<T1, T2, T3, T4, T5>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4) => TR): Plan<TR>;
    }
    interface Pattern5<T1, T2, T3, T4, T5> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T6>(other: Observable<T6>): Pattern6<T1, T2, T3, T4, T5, T6>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5) => TR): Plan<TR>;
    }
    interface Pattern6<T1, T2, T3, T4, T5, T6> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T7>(other: Observable<T7>): Pattern7<T1, T2, T3, T4, T5, T6, T7>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6) => TR): Plan<TR>;
    }
    interface Pattern7<T1, T2, T3, T4, T5, T6, T7> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T8>(other: Observable<T8>): Pattern8<T1, T2, T3, T4, T5, T6, T7, T8>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7) => TR): Plan<TR>;
    }
    interface Pattern8<T1, T2, T3, T4, T5, T6, T7, T8> {
        /**
        *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        *  @param other Observable sequence to match in addition to the current pattern.
        *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
        */
        and<T9>(other: Observable<T9>): Pattern9<T1, T2, T3, T4, T5, T6, T7, T8, T9>;
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7, item8: T8) => TR): Plan<TR>;
    }
    interface Pattern9<T1, T2, T3, T4, T5, T6, T7, T8, T9> {
        /**
        *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
        *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5, item6: T6, item7: T7, item8: T8, item9: T9) => TR): Plan<TR>;
    }

    export interface Observable<T> {
        /**
        *  Creates a pattern that matches when both observable sequences have an available value.
        *
        *  @param right Observable sequence to match with the current sequence.
        *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
        */
        and<T2>(right: Observable<T2>): Pattern2<T, T2>;
    }

    export interface Observable<T> {
        /**
        *  Matches when the observable sequence has an available value and projects the value.
        *
        *  @param {Function} selector Selector that will be invoked for values in the source sequence.
        *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
        */
        thenDo<TR>(selector: (item1: T) => TR): Plan<TR>;
    }

    export interface ObservableStatic {
        /**
        *  Joins together the results from several patterns.
        *
        *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
        *  @returns {Observable} Observable sequence with the results form matching several patterns.
        */
        when<TR>(plan: Plan<TR>): Observable<TR>;
    }

}

declare module "rx" { export = Rx; }
declare module "rx.joinpatterns" { export = Rx; }