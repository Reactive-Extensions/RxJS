# The Reactive Extensions for JavaScript... #
*...is a set of libraries to compose asynchronous and event-based programs using observable collections and LINQ-style query operators in JavaScript*

## About the Reactive Extensions ##

The Reactive Extensions for JavaScript (RxJS) is a set of libraries for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators in JavaScript. Using RxJS, developers represent asynchronous data streams with Observables, query asynchronous data streams using LINQ operators, and parameterize the concurrency in the asynchronous data streams using Schedulers. Simply put, Rx = Observables + LINQ + Schedulers.

Whether you are authoring a web-based application in JavaScript or a server-side application in Node.js, you have to deal with asynchronous and event-based programming as a matter of course. Although some patterns are emerging such as the Promise pattern, handling exceptions, cancellation, and synchronization is difficult and error-prone.

Using RxJS, you can represent multiple asynchronous data streams (that come from diverse sources, e.g., stock quote, tweets, computer events, web service requests, etc.), and subscribe to the event stream using the Observer object. The Observable notifies the subscribed Observer instance whenever an event occurs.

Because observable sequences are data streams, you can query them using standard LINQ query operators implemented by the Observable type. Thus you can filter, project, aggregate, compose and perform time-based operations on multiple events easily by using these static LINQ operators. In addition, there are a number of other reactive stream specific operators that allow powerful queries to be written. Cancellation, exceptions, and synchronization are also handled gracefully by using the methods on the Observable object.

This set of libraries include:

- **rx.js** - Core library
- **rx.aggregates.js** - aggregation event processing query operations
- **rx.binding.js** - binding operators including multicast, publish, publishLast, publishValue, and replay
- **rx.coincidence.js** - reactive coincidence join event processing query operations
- **rx.experimental.js** - experimental operators including imperative operators and forkJoin
- **rx.joinpatterns.js** - join patterns event processing query operations
- **rx.testing.js** - used to write unit tests for complex event processing queries.
- **rx.time.js** - time-based event processing query operations.


## Getting Started ##

Coming Soon

##  API Documentation ##

Core:

- Observer
- Observable

Disposables:

- CompositeDisposable
- Disposable
- RefCountDisposable
- SerialDisposable
- SingleAssignmentDisposable

Schedulers:

- Scheduler object
- Scheduler.currentThread
- Scheduler.immediate
- Scheduler.timeout
- VirtualTimeScheduler

Subjects:

 - AsyncSubject
 - BehaviorSubject
 - ReplaySubject
 - Subject

## Installation and Usage ##

There are multiple ways of getting started with the Reactive Extensions including:

In a Browser:

    <script src="rx.js"><script>

Along with a number of our extras for RxJS:
    
    <script src="rx.aggregates.js"><script>
    <script src="rx.binding.js"><script>
    <script src="rx.coincidencejs"><script>
    <script src="rx.experimental.js"><script>
    <script src="rx.joinpatterns.js"><script>
    <script src="rx.testing.js"><script>
    <script src="rx.time.js"><script>

Installing via NPM:

    npm install rxjs
    npm install -g rxjs

Using in Node.js:

    var Rx = require('rx');

Installing all of RxJS via NuGet:

    Install-Package RxJS-All

Or install via NuGet individual packages:

    Install-Package RxJS-Main
    Install-Package RxJS-Aggregates
    Install-Package RxJS-Binding
    Install-Package RxJS-Coincidence
    Install-Package RxJS-Experimental
    Install-Package RxJS-JoinPatterns
    Install-Package RxJS-Testing
    Install-Package RxJS-Time

Using RxJS with an AMD loader such as Require.js

    require({
        'paths': {
            'rx': 'path/to/rx.js'
        }
    },
    ['rx'], function(Rx) {
        var obs = Rx.Observable.returnValue(42);
        obs.subscribe(function (x) { console.log(x); });
    });

## Examples ##

## License ##


Source files are licensed under the [Microsoft Reference Source License (MS-RSL)](http://referencesource.microsoft.com/referencesourcelicense.aspx)

Minimized files are licensed under the [Reactive Extensions for .NET and JavaScript License](https://github.com/Reactive-Extensions/RxJS/blob/master/license.txt).