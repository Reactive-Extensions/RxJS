# Using Schedulers #

A scheduler controls when a subscription starts and when notifications are published. It consists of three components. It is first a data structure. When you schedule for tasks to be completed, they are put into the scheduler for queueing based on priority or other criteria. It also offers an execution context which denotes where the task is executed (e.g., in the immediately, current thread, or in another callback mechanism such as `setTimeout` or `process.nextTick`). Lastly, it has a clock which provides a notion of time for itself (by accessing the `now` method of a scheduler). Tasks being scheduled on a particular scheduler will adhere to the time denoted by that clock only.

Schedulers also introduce the notion of virtual time (denoted by the [`VirtualTimeScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/virtualtimescheduler.md) type), which does not correlate with real time that is used in our daily life. For example, a sequence that is specified to take 100 years to complete can be scheduled to complete in virtual time in a mere 5 minutes. This will be covered in the [Testing and Debugging Observable Sequences](testing.md) topic.

## Scheduler Types ##

The various Scheduler types provided by Rx all implement the `Scheduler` methods. Each of these can be created and returned by using static properties of the `Scheduler` object. The `ImmediateScheduler` (by accessing the static [`immediate`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerimmediate) property) will start the specified action immediately. The `CurrentThreadScheduler` (by accessing the static [`currentThread`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulercurrentthread) property) will schedule actions to be performed on the thread that makes the original call. The action is not executed immediately, but is placed in a queue and only executed after the current action is complete.  The `DefaultScheduler` (by accessing the static [`default`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerdefault) property) will schedule actions to be performed on a asynchronous callback, which is optimized for the particular runtime, such as `setImmediate` or `process.nextTick` on Node.js or in the browser with a fallback to `setTimeout`.

## Using Schedulers ##

You may have already used schedulers in your Rx code without explicitly stating the type of schedulers to be used. This is because all Observable operators that deal with concurrency have optional schedulers. If you do not provide the scheduler, RxJS will pick a default scheduler by using the principle of least concurrency. This means that the scheduler which introduces the least amount of concurrency that satisfies the needs of the operator is chosen.  For example, for operators returning an observable with a finite and small number of messages, RxJS calls `immediate`.  For operators returning a potentially large or infinite number of messages, `currentThread` is called. For operators which use timers, `default` is used.

Because RxJS uses the least concurrency scheduler, you can pick a different scheduler if you want to introduce concurrency for performance purpose.  To specify a particular scheduler, you can use those operator methods that take a scheduler, e.g., `return(42, Rx.Scheduler.default)`.

In the following example, the source observable sequence is producing values at a frantic pace. The default scheduler of the generate operator would place onNext messages on the `currentThread`.

```js
var obs = Rx.Observable.generate(
	0,
	function () { return true; },
	function (x) { return x + 1; },
	function (x) { return x; });
```

This will queue up on the observer quickly. We can improve this code by using the observeOn operator, which allows you to specify the context that you want to use to send pushed notifications (onNext) to observers. By default, the [`observeOn`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/observeon.md) operator ensures that `onNext` will be called as many times as possible on the current thread. You can use its overloads and redirect the `onNext` outputs to a different context. In addition, you can use the [`subscribeOn`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribeon.md) operator to return a proxy observable that delegates actions to a specific scheduler. For example, for a UI-intensive application, you can delegate all background operations to be performed on a scheduler running in the background by using `subscribeOn` and passing to it the `DefaultScheduler`.

The following example will schedule any onNext notifications on the current Dispatcher, so that any value pushed out is sent on the UI thread. This is especially beneficial to Silverlight developers who use RxJS.

```js
Rx.Observable.generate(
	0,
	function () { return true; },
	function (x) { return x + 1; },
	function (x) { return x; }
	)
	.observeOn(Rx.Scheduler.default)
	.subscribe(...);
```

Instead of using the `observeOn` operator to change the execution context on which the observable sequence produces messages, we can create concurrency in the right place to begin with. As operators parameterize introduction of concurrency by providing a scheduler argument overload, passing the right scheduler will lead to fewer places where the ObserveOn operator has to be used. For example, we can unblock the observer and subscribe to the UI thread directly by changing the scheduler used by the source, as in the following example. In this code, by using the `generate` method passing a scheduler, and providing the `Rx.Scheduler.default` instance, all values pushed out from this observable sequence will originate via an asynchronous callback.

```js
Rx.Observable.generate(
	0,
	function () { return true; },
	function (x) { return x + 1; },
	function (x) { return x; },
	Rx.Scheduler.default)
	.subscribe(...);
```

You should also note that by using the `observeOn` operator, an action is scheduled for each message that comes through the original observable sequence. This potentially changes timing information as well as puts additional stress on the system. If you have a query that composes various observable sequences running on many different execution contexts, and you are doing filtering in the query, it is best to place `observeOn` later in the query. This is because a query will potentially filter out a lot of messages, and placing the `observeOn` operator earlier in the query would do extra work on messages that would be filtered out anyway. Calling the `observeOn` operator at the end of the query will create the least performance impact.

Another advantage of specifying a scheduler type explicitly is that you can introduce concurrency for performance purpose, as illustrated by the following code.

```js
seq.groupBy(...)
  .map(function (x) { return x.observeOn(Rx.Scheduler.default); })
  .map(function (x)  { return expensive(x); })  // perform operations that are expensive on resources
```

## When to Use Which Scheduler ##

To make things a little easier when you are creating your own operators, or using the standard built-in ones, which scheduler you should use.  The following table lays out each scenario with the suggested scheduler.

<table>
	<th>
		Scenario
	</th>
	<th>
		Scheduler
	</th>
	<tr>
		<td>Constant Time Operations</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerimmediate">Rx.Scheduler.immediate</a></td>
	</tr>
	<tr>
		<td>Tail Recursive Operations</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerimmediate">Rx.Scheduler.immediate</a></td>
	</tr>
	<tr>
		<td>Iteration Operations</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulercurrentthread">Rx.Scheduler.currentThread</a></td>
	</tr>
	<tr>
		<td>Time-based Operations</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerdefault">Rx.Scheduler.default</a></td>
	</tr>
	<tr>
		<td>Asynchronous Conversions</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerdefault">Rx.Scheduler.default</a></td>
	</tr>
	<tr>
		<td>Historical Data Operations</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/historicalscheduler.md">Rx.HistoricalScheduler</a></td>
	</tr>
	<tr>
		<td>Unit Testing</td>
		<td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md">Rx.TestScheduler</a></td>
	</tr>
</table>

## See Also

*Reference*
- [Testing and Debugging Observable Sequences](testing.md)
