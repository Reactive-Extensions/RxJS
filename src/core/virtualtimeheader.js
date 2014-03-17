	// Aliases
	var Scheduler = Rx.Scheduler,
		PriorityQueue = Rx.internals.PriorityQueue,
		ScheduledItem = Rx.internals.ScheduledItem,
		SchedulePeriodicRecursive  = Rx.internals.SchedulePeriodicRecursive,
		disposableEmpty = Rx.Disposable.empty,
		inherits = Rx.internals.inherits;

	function defaultSubComparer(x, y) { return x > y ? 1 : (x < y ? -1 : 0); }
