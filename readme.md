[![Build Status](https://travis-ci.org/Reactive-Extensions/RxJS.png)](https://travis-ci.org/Reactive-Extensions/RxJS)

# The Reactive Extensions for JavaScript (RxJS) <sup>2.2</sup>... #
*...is a set of libraries to compose asynchronous and event-based programs using observable collections and Array#extras style composition in JavaScript*

The project is actively developed by Microsoft Open Technologies, Inc., in collaboration with a community of open source developers.

This project is a mirror of the [CodePlex](http://rxjs.codeplex.com/) repository.

## The Need to go Reactive ##

Reactive Programming is a hot topic as of late, especially with such things as the [Reactive Manifesto](http://www.reactivemanifesto.org/).  Applications, especially on the web have changed over the years from being a simple static page, to DHTML with animations, to the Ajax revolution.  Each time, we're adding more complexity, more data, and asynchronous behavior to our applications.  How do we manage it all?  How do we scale it?  By moving towards "Reactive Architectures" which are event-driven, resilient and responsive.  With the Reactive Extensions, you have all the tools you need to help build these systems.

## About the Reactive Extensions ##

The Reactive Extensions for JavaScript (RxJS) is a set of libraries for composing asynchronous and event-based programs using observable sequences and fluent query operators that many of you already know by Array#extras in JavaScript. Using RxJS, developers represent asynchronous data streams with Observables, query asynchronous data streams using our many operators, and parameterize the concurrency in the asynchronous data streams using Schedulers. Simply put, RxJS = Observables + Operators + Schedulers.

Whether you are authoring a web-based application in JavaScript or a server-side application in Node.js, you have to deal with asynchronous and event-based programming as a matter of course. Although some patterns are emerging such as the Promise pattern, handling exceptions, cancellation, and synchronization is difficult and error-prone.

Using RxJS, you can represent multiple asynchronous data streams (that come from diverse sources, e.g., stock quote, tweets, computer events, web service requests, etc.), and subscribe to the event stream using the Observer object. The Observable notifies the subscribed Observer instance whenever an event occurs.

Because observable sequences are data streams, you can query them using standard query operators implemented by the Observable type. Thus you can filter, project, aggregate, compose and perform time-based operations on multiple events easily by using these our many operators. In addition, there are a number of other reactive stream specific operators that allow powerful queries to be written. Cancellation, exceptions, and synchronization are also handled gracefully by using the methods on the Observable object.

But the best news of all is that you already know how to program like this.  Take for example the following JavaScript code, where we get some stock data and then manipulate and then iterate the results.

```js
/* Get stock data somehow */
var source = getStockData();

source
    .filter(function (quote) { 
        return quote.price > 30; 
    })
    .map(function (quote) { 
        return quote.price;
    })
    .forEach(function (price) {
        console.log('Prices higher than $30: $' + price);
    });
```

Now what if this data were to come as some sort of event, for example a stream, such as as a WebSocket, then we could pretty much write the same query to iterate our data, with very litle change.

```js
/* Get stock data somehow */
var source = getAsyncStockData();

var subscription = source
    .filter(function (quote) { 
        return quote.price > 30; 
    })
    .map(function (quote) { 
        return quote.price;
    })
    .subscribe(
        function (price) {
            console.log('Prices higher than $30: $' + price);
        },
        function (err) {
            console.log('Something went wrong: ' + err.message);
        });

/* When we're done */
subscription.dispose();
```

The only difference is that we can handle the errors inline with our subscription.  And when we're no longer interested in receiving the data as it comes steraming in, we call `dispose` on our subscription.

## Batteries Included ##

This set of libraries include:

- [rx.lite.js](doc/libraries/rx.lite.md) - lite version with event bindings, creation, time and standard query operators with a compat file for older browsers.
- [rx.js](doc/libraries/rx.md) - core library for ES5 compliant browsers and runtimes plus compatibility for older browsers.
- [rx.aggregates.js](doc/libraries/rx.aggregates.md) - aggregation event processing query operations
- [rx.async.js](doc/libraries/rx.async.md) - async operationrs such as events, callbacks and promises plus a compat file for older browsers.
- [rx.binding.js](doc/libraries/rx.binding.md) - binding operators including multicast, publish, publishLast, publishValue, and replay
- [rx.coincidence.js](doc/libraries/rx.coincidence.md) - reactive coincidence join event processing query operations
- [rx.experimental.js](doc/libraries/rx.experimental.md) - experimental operators including imperative operators and forkJoin
- [rx.joinpatterns.js](doc/libraries/rx.joinpatterns.md) - join patterns event processing query operations
- [rx.testing.js](doc/libraries/rx.testing.md) - used to write unit tests for complex event processing queries
- [rx.time.js](doc/libraries/rx.time.md) - time-based event processing query operations
- [rx.virtualtime.js](doc/libraries/rx.virtualtime.md) - virtual-time-based schedulers

## Why RxJS? ##

One question you may ask yourself, is why RxJS?  What about Promises?  Promises are good for solving asynchronous operations such as querying a service with an XMLHttpRequest, where the expected behavior is one value and then completion.  The Reactive Extensions for JavaScript unifies both the world of Promises, callbacks as well as evented data such as DOM Input, Web Workers, Web Sockets.  Once we have unified these concepts, this enables rich composition.

To give you an idea about rich composition, we can create an autocompletion service which takes the user input from a text input and then query a service, making sure not to flood the service with calls for every key stroke, but instead allow to go at a more natural pace.

First, we'll reference the JavaScript files, including jQuery, although RxJS has no dependencies on jQuery...

    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="rx.lite.js"></script>

Next, we'll get the user input from an input, listening to the keyup event by using the `Rx.Observable.fromEvent` method.

```js
var $input = $('#input'),
    $results = $('#results');

/* Only get the value from each key up */
var keyups = Rx.Observable.fromEvent(input, 'keyup')
    .map(function (e) {
        return e.target.value;
    })
    .filter(function (text) {
        return text.length > 2;
    });

/* Now throttle/debounce the input for 500ms */
var throttled = keyups
    .throttle(500 /* ms */);

/* Now get only distinct values, so we eliminate the arrows and other control characters */
var distinct = throttled
    .distinctUntilChanged();
```

Now, let's query Wikipedia!  We'll use the new Promise bindings which will bind to any [Promises A+](https://github.com/promises-aplus/promises-spec) implementation through the `Rx.Observable.fromPromise` method.

```js
function searchWikipedia (term) {
    var promise = $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: encodeURI(term)
        }
    }).promise();
    return Rx.Observable.fromPromise(promise);
}
```

Once that is created, now we can tie together the distinct throttled input and then query the service.  In this case, we'll call `flatMapLatest` to get the value and ensure that we're not introducing any out of order sequence calls.  

```js
var suggestions = distinct
    .flatMapLatest(searchWikipedia);
```

Finally, we call the subscribe method on our observable sequence to start pulling data.

```js
suggestions.subscribe( function (data) {
    var res = data[1];

    /* Do something with the data like binding */
    $results.empty();

    $.each(res, function (_, value) {
        $('<li>' + value + '</li>').appendTo($results);
    });    
}, function (e) {
    /* handle any errors */
    $results.empty();

    $('<li>Error: ' + error + '</li>').appendTo($results);    
});
```

And there you have it!

## Dive In! ##

You can find the documentation [here](https://github.com/Reactive-Extensions/RxJS/tree/master/doc) as well as examples [here](https://github.com/Reactive-Extensions/RxJS/tree/master/examples) and plenty of [unit tests](https://github.com/Reactive-Extensions/RxJS/tree/master/tests).

## Resources

- Contact us
    - [Tech Blog](http://blogs.msdn.com/b/rxteam) 
    - [Twitter @ReactiveX](https://twitter.com/ReactiveX)
    - [Twitter @OpenAtMicrosoft](http://twitter.com/OpenAtMicrosoft)

- Required Reading
    - [Reactive Manifesto](http://www.reactivemanifesto.org/)

- Podcasts
    - [.NET Rocks #907](http://dotnetrocks.com/default.aspx?showNum=907)
    - [JavaScript Jabber #83](http://javascriptjabber.com/083-jsj-frp-and-rxjs-with-matthew-podwysocki/)

- Articles
    - [Your Mouse is a Database](http://queue.acm.org/detail.cfm?id=2169076)

- Tutorials
    - [Learn RxJS](http://reactive-extensions.github.io/learnrx/)
    - [RxJS Koans](https://github.com/mattpodwysocki/RxJSKoans)
    - [Rx Workshop](http://rxworkshop.codeplex.com/)

- Presentations
    - [Don't Cross the Streams - Cascadia.js 2012](http://www.slideshare.net/mattpodwysocki/cascadiajs-dont-cross-the-streams)
    - [Curing Your Asynchronous Blues - Strange Loop 2013](https://github.com/Reactive-Extensions/StrangeLoop2013)

- Videos
    - [Hello RxJS - Channel 9](http://channel9.msdn.com/Blogs/Charles/Introducing-RxJS-Reactive-Extensions-for-JavaScript)
    - [MIX 2011](http://channel9.msdn.com/events/MIX/MIX11/HTM07)
    - [RxJS Today and Tomorrow - Channel 9](http://channel9.msdn.com/Blogs/Charles/Matthew-Podwysocki-and-Bart-J-F-De-Smet-RxJS-Today-and-Tomorrow)
    - [Cascadia.js 2012](http://www.youtube.com/watch?v=FqBq4uoiG0M)
    - [Reactive Extensions Videos on Channel 9](http://channel9.msdn.com/Tags/reactive+extensions)

- Reference Material
    - [Intro to Rx](http://introtorx.com/)
    - [101 Rx Samples Wiki](http://rxwiki.wikidot.com/101samples)
    - [Rx Design Guidelines](http://go.microsoft.com/fwlink/?LinkID=205219)
    - [Beginners Guide to Rx](http://msdn.microsoft.com/en-us/data/gg577611)

- Books
    - [Intro to Rx](http://www.amazon.com/Introduction-to-Rx-ebook/dp/B008GM3YPM/)
    - [Programming Reactive Extensions and LINQ](http://www.amazon.com/Programming-Reactive-Extensions-Jesse-Liberty/dp/1430237473/)

## GETTING STARTED

There are a number of ways to get started with RxJS. The files are available on [cdnjs](http://cdnjs.com/) and [jsDelivr](http://www.jsdelivr.com/#!rxjs).

### Download the Source

    git clone https://github.com/Reactive-Extensions/rxjs.git
    cd ./rxjs

### Installing with [NPM](https://npmjs.org/)

    npm install rx
    npm install -g rx

### Using with Node.js and Ringo.js

    var Rx = require('rx');

### Installing with [Bower](http://bower.io/)

    bower install rxjs

### Installing with [Jam](http://jamjs.org/)
    
    jam install rx

### Installing All of RxJS via [NuGet](http://nuget.org/)

    Install-Package RxJS-All

### Install individual packages via [NuGet](http://nuget.org/):

    Install-Package RxJS-Main
    Install-Package RxJS-Aggregates
    Install-Package RxJS-Async
    Install-Package RxJS-Binding
    Install-Package RxJS-Coincidence
    Install-Package RxJS-Experimental
    Install-Package RxJS-JoinPatterns
    Install-Package RxJS-Testing
    Install-Package RxJS-Time

### In a Browser:

    <script src="rx.js"></script>

### Along with a number of our extras for RxJS:
    
    <script src="rx.aggregates.js"></script>
    <script src="rx.async.js"></script>
    <script src="rx.binding.js"></script>
    <script src="rx.coincidencejs"></script>
    <script src="rx.experimental.js"></script>
    <script src="rx.joinpatterns.js"></script>
    <script src="rx.time.js"></script>
    <script src="rx.virtualtime.js"></script>
    <script src="rx.testing.js"></script>

### Using RxJS with an AMD loader such as Require.js

```js
require({
    'paths': {
        'rx': 'path/to/rx.js'
    }
},
['rx'], function(Rx) {
    var obs = Rx.Observable.return(42);
    obs.subscribe(function (x) { console.log(x); });
});
```

## What about my libraries? ##

The Reactive Extensions for JavaScript have no external dependencies any library, so they'll work well with just about any library.  We provide bridges and support for various libraries including:

- [AngularJS](https://github.com/Reactive-Extensions/rx.angular.js)
- [HTML DOM](https://github.com/Reactive-Extensions/RxJS-DOM)
- [jQuery (1.4+)](https://github.com/Reactive-Extensions/RxJS-jQuery)
- [MooTools](https://github.com/Reactive-Extensions/RxJS-MooTools)
- [Dojo 1.7+](https://github.com/Reactive-Extensions/RxJS-Dojo)
- [ExtJS](https://github.com/Reactive-Extensions/RxJS-ExtJS)

In addition, we have support for [common Node.js functions](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js) such as binding to callbacks and the `EventEmitter` class.

## Compatibility ##

RxJS has been thoroughly tested against all major browsers and supports IE6+, Chrome 4+, FireFox 1+, and Node.js v0.4+. 

## Contributing ##

There are lots of ways to [contribute](https://github.com/Reactive-Extensions/RxJS/wiki/Contributions) to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/RxJS/wiki/Contributors).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

## License ##

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
Microsoft Open Technologies would like to thank its contributors, a list
of whom are at http://rx.codeplex.com/wikipage?title=Contributors.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.
