# What are the Reactive Extensions for JavaScript (RxJS)? #

The Reactive Extensions for JavaScript (RxJS) is a library for composing asynchronous and event-based programs using observable sequences and [LINQ-style query operators](http://en.wikipedia.org/wiki/LINQ). Using RxJS, developers *__represent__* asynchronous data streams with [Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), *__query__* asynchronous data streams using [LINQ operators](http://msdn.microsoft.com/en-us/library/hh242983.aspx), and *__parameterize__* the concurrency in the asynchronous data streams using [Schedulers](http://msdn.microsoft.com/en-us/library/hh242963.aspx). Simply put, Rx = Observables + LINQ + Schedulers.

Whether you are authoring a web-based application or server-side applications with [Node.js](http://nodejs.org), you have to deal with asynchronous and event-based programming constantly. Web applications and Node.js applications have I/O operations and computationally expensive tasks that might take a long time to complete and potentially block the main thread. Furthermore, handling exceptions, cancellation, and synchronization is difficult and error-prone.

Using RxJS, you can represent multiple asynchronous data streams (that come from diverse sources, e.g., stock quote, tweets, computer events, web service requests, etc.), and subscribe to the event stream using the `Observer` object. The `Observable` object notifies the subscribed `Observer` object whenever an event occurs.

Because observable sequences are data streams, you can query them using standard query operators implemented by the Observable extension methods. Thus you can filter, project, aggregate, compose and perform time-based operations on multiple events easily by using these standard query operators. In addition, there are a number of other reactive stream specific operators that allow powerful queries to be written.  Cancellation, exceptions, and synchronization are also handled gracefully by using the extension methods provided by Rx.

RxJS complements and interoperates smoothly with both synchronous data streams such as Arrays, Sets and Maps and single-value asynchronous computations such as Promises as the following diagram shows:

<table>
   <th></th><th>Single return value</th><th>Mutiple return values</th>
   <tr>
      <td>Pull/Synchronous/Interactive</td>
      <td>Object</td>
      <td>Iterables (Array | Set | Map | Object)</td>
   </tr>
   <tr>
      <td>Push/Asynchronous/Reactive</td>
      <td>Promise</td>
      <td>Observable</td>
   </tr>
</table>

## Pushing vs. Pulling Data ##

In interactive programming, the application actively polls a data source for more information by retrieving data from a sequence that represents the source. Such behavior is represented by the iterator pattern of JavaScript Arrays, Objects, Sets, Maps, etc. In interactive programming, one must get the next item by either getting an item by an index in an Array, or through [ES6 iterators](http://wiki.ecmascript.org/doku.php?id=harmony:iterators).

The application is active in the data retrieval process: it decides about the pace of the retrieval by calling `next` at its own convenience. This enumeration pattern is synchronous, which means your application might be blocked while polling the data source. Such pulling pattern is similar to visiting your library and checking out a book. After you are done with the book, you pay another visit to check out another one.

On the other hand, in reactive programming, the application is offered more information by subscribing to a data stream (called observable sequence in RxJS), and any update is handed to it from the source. The application is passive in the data retrieval process: apart from subscribing to the observable source, it does not actively poll the source, but merely react to the data being pushed to it. When the event has completed, the source will send a notice to the subscriber. In this way, your application will not be blocked by waiting for the source to update.
This is the push pattern employed by Reactive Extensions for JavaScript. This is similar to joining a book club in which you register your interest in a particular genre, and books that match your interest are automatically sent to you as they are published. You do not need to stand in a line to acquire something that you want. Employing a push pattern is especially helpful in heavy UI environment in which the UI thread cannot be blocked while the application is waiting for some events, which is essential in JavaScript environments which has its own set of asynchronous requirements. In summary, by using RxJS, you can make your application more responsive.

The push model implemented by Rx is represented by the observable pattern of `Observable`/`Observer`. The `Observable` will notify all the observers automatically of any state changes. To register an interest through a subscription, you use the `subscribe` method of `Observable`, which takes on an `Observer` and returns a `Disposable` object. This gives you the ability to track your subscription and be able to dispose the subscription. You can essentially treat the observable sequence (such as a sequence of mouseover events) as if it were a normal collection. RxJS’s built-in query implementation over observable sequences allows developers to compose complex event processing queries over push-based sequences such as events, callbacks, Promises,  HTML5 Geolocation APIs, and much much more. For more information on these two interfaces, see [Exploring The Major Concepts in RxJS](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/exploring.md).
