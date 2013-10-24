# `Rx.HistoricalScheduler` class #

Provides a virtual time scheduler that uses a `Date` for absolute time and time spans for relative time.  This inherits from the `Rx.VirtualTimeScheduler` class.

## Usage ##

The following shows an example of using the `Rx.HistoricalScheduler`.  We'll add a `run` method which uses the `Rx.Scheduler.timeout` to send the data along.

```js
var scheduler = new Rx.HistoricalScheduler();

/* Run through some old data over time with simulated time */
scheduler.run = function () {

    var day = new Date(0), 
        parent = this;

    Rx.Scheduler.timeout.scheduleRecursiveWithRelative(
        1,
        function (self) {
            while (true) {
                var next = parent.getNext();
                if (next == null)  {
                    return;
                }

                if (day !== next.dueTime) {
                    day = next.dueTime;
                    self(1);
                    return;
                }
                else {
                    next.invoke();
                }
            }
        }
    );      
};

// Get stock quotes from somewhere
var quotes = getQuotes();

var subject = new Rx.Subject();

quotes.forEach(function (quote) {
    scheduler.scheduleAbsolute(quote.date, function () {
        subject.onNext(quote);
    });
});

// Subscribe to subject and listen
subject.subscribe(function (quote) {
    // Bind quote data to the server or do more analysis
});

// Start pumping data
scheduler.run();
```

### Location

- rx.virtualtime.js

## `HistoricalScheduler Constructor` ##
- [`constructor`](#rxhistoricalschedulerinitialclock-comparer)

## Inherited Classes ##
- [`Rx.HistoricalScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/virtualtimescheduler.md)

## _HistoricalScheduler Constructor_ ##

### <a id="rxhistoricalschedulerinitialclock-comparer"></a>`Rx.HistoricalScheduler([initialClock], [comparer])`
<a href="#rxhistoricalschedulerinitialclock-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/historicalscheduler.js#L12-L16 "View in source") 

Creates a new historical scheduler with the specified initial clock value.

#### Arguments
1. [`initialClock`] *(Function)*: Initial value for the clock.
2. [`comparer`] *(Function)*: Comparer to determine causality of events based on absolute time.

#### Example
```js
function comparer (x, y) {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
}

var scheduler = new Rx.HistoricalScheduler(
    new Date(0),  /* initial clock of 0 */
    comparer      /* comparer for determining order */
);  
```

### Location

- rx.virtualtime.js

* * *