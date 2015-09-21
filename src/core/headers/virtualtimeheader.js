  // Aliases
  var Scheduler = Rx.Scheduler,
    ScheduledItem = Rx.internals.ScheduledItem,
    SchedulePeriodicRecursive  = Rx.internals.SchedulePeriodicRecursive,
    PriorityQueue = Rx.internals.PriorityQueue,
    inherits = Rx.internals.inherits,
    defaultSubComparer = Rx.helpers.defaultSubComparer,
    notImplemented = Rx.helpers.notImplemented;
