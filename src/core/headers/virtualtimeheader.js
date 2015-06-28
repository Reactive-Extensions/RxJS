  // Aliases
  var Scheduler = Rx.Scheduler,
    ScheduledItem = Rx.internals.ScheduledItem,
    SchedulePeriodicRecursive  = Rx.internals.SchedulePeriodicRecursive,
    disposableEmpty = Rx.Disposable.empty,
    inherits = Rx.internals.inherits,
    defaultSubComparer = Rx.helpers.defaultSubComparer,
    notImplemented = Rx.helpers.notImplemented;
