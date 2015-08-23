  // Defaults
  var Observer = Rx.Observer,
    Observable = Rx.Observable,
    Disposable = Rx.Disposable,
    disposableEmpty = Disposable.empty,
    disposableCreate = Disposable.create,
    CompositeDisposable = Rx.CompositeDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    Scheduler = Rx.Scheduler,
    ScheduledItem = Rx.internals.ScheduledItem,
    SchedulePeriodicRecursive  = Rx.internals.SchedulePeriodicRecursive,
    inherits = Rx.internals.inherits,
    notImplemented = Rx.helpers.notImplemented,
    defaultComparer = Rx.helpers.defaultComparer = function (a, b) { return isEqual(a, b); };
