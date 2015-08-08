/// <reference path="./scheduler.ts" />
module Rx {
    export interface SchedulerStatic {
        timeout: IScheduler;
        default: IScheduler;
    }
}

(function() {
    var s : Rx.IScheduler;
    s = Rx.Scheduler.timeout;
    s = Rx.Scheduler.default;
})
