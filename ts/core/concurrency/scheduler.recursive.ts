/// <reference path="../disposables/disposable.ts" />
module Rx {
    export interface IScheduler {
        /**
         * Schedules an action to be executed recursively.
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursive(action: (action: () => void) => void): IDisposable;

        /**
         * Schedules an action to be executed recursively.
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithState<TState>(state: TState, action: (state: TState, action: (state: TState) => void) => void): IDisposable;

        /**
         * Schedules an action to be executed recursively after a specified relative due time.
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.
         * @param {Number}dueTime Relative time after which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithRelative(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;

        /**
         * Schedules an action to be executed recursively after a specified relative due time.
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param {Number}dueTime Relative time after which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithRelativeAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.
         * @param {Number}dueTime Absolute time at which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithAbsolute(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param {Number}dueTime Absolute time at which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        scheduleRecursiveWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;
    }
}

(function() {
    var s: Rx.IScheduler;

    var d: Rx.IDisposable = s.scheduleRecursive(() => { });
    var d: Rx.IDisposable = s.scheduleRecursiveWithState('state', (s, a) => { });
    var d: Rx.IDisposable = s.scheduleRecursiveWithRelative(100, (d) => { });
    var d: Rx.IDisposable = s.scheduleRecursiveWithRelativeAndState('state', 100, (s, a) => { });
    var d: Rx.IDisposable = s.scheduleRecursiveWithAbsolute(100, (d) => { });
    var d: Rx.IDisposable = s.scheduleRecursiveWithAbsoluteAndState('state', 100, (s, a) => { });
})
