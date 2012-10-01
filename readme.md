# RxJS - Reactive Extensions for JavaScript #

----------

The Reactive Extensions for JavaScript (RxJS) are a set of libraries for composing and coordinating asynchronous and event-based programming that works across many JavaScript runtimes including all browsers and Node.js.

This set of libraries include:

- **rx.js** - Core library
- **rx.aggregates.js** - aggregation event processing query operations
- **rx.binding.js** - binding operators including multicast, publish, publishLast, publishValue, and replay
- **rx.coincidence.js** - reactive coincidence join event processing query operations
- **rx.experimental.js** - experimental operators including imperative operators and forkJoin
- **rx.joinpatterns.js** - join patterns event processing query operations
- **rx.testing.js** - used to write unit tests for complex event processing queries.
- **rx.time.js** - time-based event processing query operations.


## Installation and Usage ##

----------
There are multiple ways of getting started with the Reactive Extensions including:

In a Browser:

    <script src="rx.js"></script>

Along with a number of our extras for RxJS:
    
    <script src="rx.aggregates.js"></script>
    <script src="rx.binding.js"></script>
    <script src="rx.coincidencejs"></script>
    <script src="rx.experimental.js"></script>
    <script src="rx.joinpatterns.js"></script>
    <script src="rx.testing.js"></script>
    <script src="rx.time.js"></script>

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

## License ##

----------

Source files are licensed under the [Microsoft Reference Source License (MS-RSL)](http://referencesource.microsoft.com/referencesourcelicense.aspx)

Minimized files are licensed under the [Reactive Extensions for .NET and JavaScript License](https://github.com/Reactive-Extensions/RxJS/blob/master/license.txt).