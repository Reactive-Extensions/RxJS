declare module Rx {

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
        * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
        * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
        * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of windows.
        */
        windowWithTime(timeSpan: number, timeShift: number, scheduler?: IScheduler): Observable<Observable<T>>;
        /**
        *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
        * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
        * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
        * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of windows.
        */
        windowWithTime(timeSpan: number, scheduler?: IScheduler): Observable<Observable<T>>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
        * @param {Number} timeSpan Maximum time length of a window.
        * @param {Number} count Maximum element count of a window.
        * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of windows.
        */
        windowWithTimeOrCount(timeSpan: number, count: number, scheduler?: IScheduler): Observable<Observable<T>>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
        * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
        * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
        * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of buffers.
        */
        bufferWithTime(timeSpan: number, timeShift: number, scheduler?: IScheduler): Observable<T[]>;
        /**
        *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
        * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
        * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
        * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of buffers.
        */
        bufferWithTime(timeSpan: number, scheduler?: IScheduler): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
        * @param {Number} timeSpan Maximum time length of a buffer.
        * @param {Number} count Maximum element count of a buffer.
        * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence of buffers.
        */
        bufferWithTimeOrCount(timeSpan: number, count: number, scheduler?: IScheduler): Observable<T[]>;
    }

	export interface TimeInterval<T> {
		value: T;
		interval: number;
	}

    export interface Observable<T> {
        /**
        *  Records the time interval between consecutive values in an observable sequence.
        *
        * @example
        *  1 - res = source.timeInterval();
        *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
        *
        * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
        * @returns {Observable} An observable sequence with time interval information on values.
        */
        timeInterval(scheduler?: IScheduler): Observable<TimeInterval<T>>;
    }

    export interface ObservableStatic {
        /**
         *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
         *
         * @example
         *  res = source.generateWithAbsoluteTime(0,
         *      function (x) { return return true; },
         *      function (x) { return x + 1; },
         *      function (x) { return x; },
         *      function (x) { return new Date(); }
         *  });
         *
         * @param {Mixed} initialState Initial state.
         * @param {Function} condition Condition to terminate generation (upon returning false).
         * @param {Function} iterate Iteration step function.
         * @param {Function} resultSelector Selector function for results produced in the sequence.
         * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
         * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
         * @returns {Observable} The generated sequence.
         */
        generateWithAbsoluteTime<TState, TResult>(
            initialState: TState,
            condition: (state: TState) => boolean,
            iterate: (state: TState) => TState,
            resultSelector: (state: TState) => TResult,
            timeSelector: (state: TState) => Date,
            scheduler?: IScheduler): Observable<TResult>;
    }

    export interface ObservableStatic {
        /**
         *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
         *
         * @example
         *  res = source.generateWithRelativeTime(0,
         *      function (x) { return return true; },
         *      function (x) { return x + 1; },
         *      function (x) { return x; },
         *      function (x) { return 500; }
         *  );
         *
         * @param {Mixed} initialState Initial state.
         * @param {Function} condition Condition to terminate generation (upon returning false).
         * @param {Function} iterate Iteration step function.
         * @param {Function} resultSelector Selector function for results produced in the sequence.
         * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
         * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
         * @returns {Observable} The generated sequence.
         */
        generateWithRelativeTime<TState, TResult>(
            initialState: TState,
            condition: (state: TState) => boolean,
            iterate: (state: TState) => TState,
            resultSelector: (state: TState) => TResult,
            timeSelector: (state: TState) => number,
            scheduler?: IScheduler): Observable<TResult>;
    }

    export interface Observable<T> {
        /**
        *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
        *
        * @example
        *  1 - res = source.delaySubscription(5000); // 5s
        *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
        *
        * @param {Number} dueTime Relative or absolute time shift of the subscription.
        * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
        * @returns {Observable} Time-shifted sequence.
        */
        delaySubscription(dueTime: number, scheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
        *
        *  1 - res = source.skipLastWithTime(5000);
        *  2 - res = source.skipLastWithTime(5000, scheduler);
        *
        * @description
        *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
        *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
        *  result sequence. This causes elements to be delayed with duration.
        * @param {Number} duration Duration for skipping elements from the end of the sequence.
        * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
        * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
        */
        skipLastWithTime(duration: number, scheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
        * @description
        *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
        *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
        *  result sequence. This causes elements to be delayed with duration.
        * @param {Number} duration Duration for taking elements from the end of the sequence.
        * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
        */
        takeLastWithTime(duration: number, timerScheduler?: IScheduler, loopScheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
        * @description
        *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
        *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
        *  result sequence. This causes elements to be delayed with duration.
        * @param {Number} duration Duration for taking elements from the end of the sequence.
        * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
        */
        takeLastBufferWithTime(duration: number, scheduler?: IScheduler): Observable<T[]>;
    }

    export interface Observable<T> {
        /**
        *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
        *
        * @example
        *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
        * @description
        *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
        *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
        *  result sequence. This causes elements to be delayed with duration.
        * @param {Number} duration Duration for taking elements from the start of the sequence.
        * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
        */
        takeWithTime(duration: number, scheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
        *
        * @example
        *  1 - res = source.skipWithTime(5000, [optional scheduler]);
        *
        * @description
        *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
        *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
        *  may not execute immediately, despite the zero due time.
        *
        *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
        * @param {Number} duration Duration for skipping elements from the start of the sequence.
        * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
        */
        skipWithTime(duration: number, scheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
        *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
        *
        * @examples
        *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
        *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
        * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
        * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
        */
        skipUntilWithTime(startTime: Date, scheduler?: IScheduler): Observable<T>;
        /**
        *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
        *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
        *
        * @examples
        *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
        *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
        * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
        * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
        * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
        */
        skipUntilWithTime(duration: number, scheduler?: IScheduler): Observable<T>;
    }

    export interface Observable<T> {
        /**
        *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
        * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
        * @param {Scheduler} [scheduler] Scheduler to run the timer on.
        * @returns {Observable} An observable sequence with the elements taken until the specified end time.
        */
        takeUntilWithTime(endTime: Date, scheduler?: IScheduler): Observable<T>;
        /**
        *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
        * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
        * @param {Scheduler} [scheduler] Scheduler to run the timer on.
        * @returns {Observable} An observable sequence with the elements taken until the specified end time.
        */
        takeUntilWithTime(duration: number, scheduler?: IScheduler): Observable<T>;
    }

}
declare module "rx.time" { export = Rx; }
