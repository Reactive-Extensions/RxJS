	// Aliases
	var Scheduler = Rx.Scheduler,
		PriorityQueue = Rx.Internals.PriorityQueue,
		ScheduledItem = Rx.Internals.ScheduledItem,
		SchedulePeriodicRecursive  = Rx.Internals.SchedulePeriodicRecursive,
		disposableEmpty = Rx.Disposable.empty,
		inherits = Rx.Internals.inherits;

	function defaultSubComparer(x, y) { return x - y; }
