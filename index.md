---
layout: default
title: RxJS Reactive Extensions for JavaScript
---

<h2 class="tag"> Clean Composable Code</h2>

# What is RxJS?

RxJS or _Reactive Extensions for JavaScript_ is a library for transforming, composing, and querying streams of data. We mean all kinds of data too, from simple arrays of values, to series of events (unfortunate or otherwise), to complex flows of data.

RxJS makes it easy to:

* _transform_ data using methods like [aggregation](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-aggregate) and [projection](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-select).
* _compose_ data using methods like [zip](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-zip) and [selectMany](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-selectMany).
* _query_ data using methods like [where](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-where) and [any](https://github.com/Reactive-Extensions/RxJS/wiki/Observable#wiki-any).

## Why use it?

Here's a few reasons for choosing RxJS:

* Our emphasis is on _queryability_ and _composibility_. Consolidating disparate streams into a meaningful whole is a first class story.
* We take a general approach to data. We're not tied to any specific domain. This gives you a common vocabulary for dealing with streams of arbitrary data.
* The dust has settled on our API. RxJS has a history and our API has gone through some hardening. 


# Install

There are multiple ways of getting started with the Reactive Extensions. 

## Browser

Download [the latest](https://raw.github.com/Reactive-Extensions/RxJS/master/rx.js) from our repository. Or if you prefer, grab the [minified version](https://raw.github.com/Reactive-Extensions/RxJS/master/rx.min.js);

    <script src="rx.js"></script>

Along with a number of our extras for RxJS:
    
    <script src="rx.aggregates.js"></script>
    <script src="rx.binding.js"></script>
    <script src="rx.coincidencejs"></script>
    <script src="rx.experimental.js"></script>
    <script src="rx.joinpatterns.js"></script>
    <script src="rx.testing.js"></script>
    <script src="rx.time.js"></script>

## NPM:

    npm install rxjs
    npm install -g rxjs

Using in Node.js:

    var Rx = require('rx');

## NuGet:

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

## AMD
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

# A Brief Example

Let's see how RxJS can help to compose UI events.

 > RxJS is to events as promises are to async.

<pre><code data-language="JavaScript">// Here's an example using jQuery

var $dragTarget = $('#dragTarget'), 
    $doc = $(document);

var mouseup = $dragTarget.mouseupAsObservable(),
var mousemove = $doc.mousemoveAsObservable(),
var mousedown = $doc.mousedownAsObservable().select(function(ev) {
        ev.preventDefault();
        return {
            left: event.clientX - dragTarget.offset().left,
            top: event.clientY - dragTarget.offset().top
        };
    });

var mousedrag = mousedown.selectMany(function(imageOffset) {
        return mousemove.select(function(pos) {
            return {
                left: pos.clientX - imageOffset.left,
                top: pos.clientY - imageOffset.top
            };
        }).takeUntil(mouseup);
    });

mousedrag.subscribe(function(pos) {
     $dragTarget.css({top: pos.top, left: pos.left });
});
</code></pre>

# Compatible Libraries

RxJS has lots of friends because it knows how to play nice with others.
Here's a list of the current bindings using RxJS with your favorite libraries and stacks.

* [HTML DOM](https://github.com/Reactive-Extensions/rxjs-html)
* [NodeJS](https://github.com/Reactive-Extensions/rxjs-node)
* [jQuery](https://github.com/Reactive-Extensions/rxjs-jquery)
* [JavaScript Library for Windows 8](https://github.com/Reactive-Extensions/rxjs-winjs)
* [MooTools](https://github.com/Reactive-Extensions/rxjs-mootools)
* [Ext JS](https://github.com/Reactive-Extensions/rxjs-extjs)
* [Dojo Toolkit](https://github.com/Reactive-Extensions/rxjs-dojo)

# More Examples

Each of the binding repositories listed above has relevant samples. 
There's also a [demo application](https://github.com/Reactive-Extensions/rxjs-winjs-sample) for Windows 8.

Here's one more example though demonstrating how to implement an autocomplete search with RxJS:

<pre><code data-language="JavaScript">// This uses the HTML DOM bindings
function searchWikipedia (term) {
    var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
        + term + '&callback=JSONPCallback';
    return Rx.Observable.getJSONPRequest(url);
}

function clearChildren (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }                
}

// We'll call this once the DOM is ready.
function initialize () {
    var input = document.getElementById('textInput')
    , ul = document.getElementById('results')

    , keyup = Rx.Observable.fromEvent(input, 'keyup').select(function(ev) {
            return ev.target.value;
        }).where(function(text) {
            return text.length > 2;
        }).throttle(500)
        .distinctUntilChanged(),

        searcher = keyup.select(function (text) {
            return searchWikipedia(text);
        }).switchLatest()
        .where(function (data) {
            return data.length === 2; 
        });

    searcher.subscribe(function (data) {                    
        var results = data[1];

        clearChildren(ul);

        for (var i = 0, len = results.length; i < len; i++) {
            var li = document.createElement('li');
            li.innerHTML = results[i];
            ul.appendChild(li);
        }
    }, function (error) {
        clearChildren(ul);
        var li = document.createElement('li');
        li.innerHTML = 'Error: ' + error.message;
        ul.appendChild(li);
    });

}
</code></pre>

<pre><code data-language="HTML"> <!-- here's the necessary markup -->
<input type="text" id="textInput"></input>
<ul id="results"></ul>
</code></pre>

# Documentation

Get a deeper overview from the project's [readme](https://github.com/Reactive-Extensions/RxJS/blob/master/readme.md).

##  API Documentation ##
_More is on the way!_

Core:

- Observer
- [Observable](https://github.com/Reactive-Extensions/RxJS/wiki/Observable)

Subjects:

 - AsyncSubject
 - BehaviorSubject
 - ReplaySubject
 - Subject

Schedulers:

- Scheduler object
- Scheduler.currentThread
- Scheduler.immediate
- Scheduler.timeout
- VirtualTimeScheduler

Disposables:

- CompositeDisposable
- Disposable
- RefCountDisposable
- SerialDisposable
- SingleAssignmentDisposable
