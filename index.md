---
layout: default
title: RxJS Reactive Extensions for JavaScript
---

<h2 class="tag"> Clean Declarative Code</h2>

# What is RxJS?

aka _Reactive Extensions for JavaScript_. 

RxJS a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators. Using Rx, you can represent asynchronous data streams with Observables and much more.

RxJS provides easy-to-use conversions from existing DOM, XmlHttpRequest (AJAX), and jQuery events to Rx push-collections, allowing you to seamlessly plug Rx into your existing apps.

# Show me

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

# Bindings

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

It's on its way. :-)
