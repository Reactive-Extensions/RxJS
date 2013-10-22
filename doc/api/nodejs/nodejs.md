# Node.js Integration #

The Reactive Extensions for JavaScript provides integration points to the core Node.js libraries.  

<!-- div -->

## `Rx.Node Methods`

### Callback Handlers

- [`fromCallback`](#rxnodefromcallbackfunc-scheduler-context)
- [`fromNodeCallback`](#rxnodefromnodecallbackfunc-scheduler-context)

### Event Handlers

- [`fromEvent`](#rxnodefromeventeventemitter-eventname)
- [`toEventEmitter`](#rxnodetoeventemitterobservable-eventname-handler)

### Stream Handlers

- [`fromStream`](#rxnodefromstreamstream)
- [`writeToStream`](#rxnodewritetostreamobservable-stream-encoding)

## _Rx.Node Methods_ ##

### Callback Handlers ###

### <a id="rxnodefromcallbackfunc-scheduler-context"></a>`Rx.Node.fromCallback(func, [scheduler], [context])`
<a href="#rxnodefromcallbackfunc-scheduler-context">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L23-L41 "View in source") 

Converts a callback function to an observable sequence. 

#### Arguments
1. `func` *(Function)*: Callback function
2. `[scheduler = Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler used to execute the callback.
3. `[context]` *(Any)*: The context to execute the callback.

#### Returns
*(Function)*: Function, when called with arguments, creates an Observable sequence from the callback.

#### Example
```js
var fs = require('fs');
var Rx = require('Rx');

var source = Rx.Node.fromCallback(fs.exists)('/etc/passwd');

var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    }
);

var subscription = source.subscribe(observer);

// => Next: true
// => Completed
```

### Location

- rx.node.js

* * *

### <a id="rxnodefromnodecallbackfunc-scheduler-context"></a>`Rx.Node.fromNodeCallback(func, [scheduler], [context])`
<a href="#rxnodefromcallbackfunc-scheduler-context">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L50-L75 "View in source") 

Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.

#### Arguments
1. `func` *(Function)*: Callback function which must be in function (err, ...) format.
2. `[scheduler = Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler used to execute the callback.
3. `[context]` *(Any)*: The context to execute the callback.

#### Returns
*(Function)*: An function which when applied, returns an observable sequence with the callback arguments as an array.

#### Example
```js
var fs = require('fs');
var Rx = require('Rx');

var source = Rx.Node.fromNodeCallback(fs.stat)('file.txt');

var observer = Rx.Observer.create(
    function (x) {
        var stat = x[0];
        console.log('Next: ' + stat.isFile());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    }
);

var subscription = source.subscribe(observer);

// => Next: true
// => Completed
```

### Location

- rx.node.js

* * *

### Event Handlers ###

### <a id="rxnodefromeventeventemitter-eventname"></a>`Rx.Node.fromEventEmitter(eventEmitter, eventName)`
<a href="#rxnodefromeventeventemitter-eventname">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L83-L95 "View in source") 

Handles an event from the given EventEmitter as an observable sequence.

#### Arguments
1. `eventEmitter` *(EventEmitter)*: The EventEmitter to subscribe to the given event.
2. `eventName` *(String)*: The event name to subscribe.

#### Returns
*(Observable)*: An observable sequence generated from the named event from the given EventEmitter.

#### Example
```js
var EventEmitter = require('events').EventEmitter;
var Rx = require('Rx');

var emitter = new EventEmitter();

var source = Rx.Node.fromEventEmitter(emitter, 'data');

var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    }
);

var subscription = source.subscribe(observer);

emitter.emit('data', 'foo');

// => Next: foo
```

### Location

- rx.node.js

* * *

### <a id="rxnodetoeventemitterobservable-eventname"></a>`Rx.Node.toEventEmitter(observable, eventName)`
<a href="#rxnodetoeventemitterobservable-eventname">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L105-L122 "View in source") 

Converts the given observable sequence to an event emitter with the given event name. 
The errors are handled on the 'error' event and completion on the 'end' event.

#### Arguments
1. `observable` *(Obsesrvable)*: The observable sequence to convert to an EventEmitter.
2. `eventName` *(String)*: The event name to subscribe.

#### Returns
*(EventEmitter)*: An EventEmitter which emits the given eventName for each onNext call in addition to 'error' and 'end' events.

#### Example
```js
var Rx = require('Rx');

var source = Rx.Observable.return(42);

var emitter = Rx.Node.toEventEmitter(source, 'data');

emitter.on('data', function (data) {
    console.log('Data: ' + data); 
});

emitter.on('end', function () {
    console.log('End');
});

// Ensure to call publish to fire events from the observable
emitter.publish();

// => Data: 42
// => End
```

### Location

- rx.node.js

* * *

### Stream Handlers ###

### <a id="rxnodefromstreamstream"></a>`Rx.Node.fromStream(stream)`
<a href="#rxnodefromstreamstream">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L129-L153 "View in source") 

Converts a flowing stream to an Observable sequence.

#### Arguments
1. `stream` *(Stream)*: A stream to convert to a observable sequence.

#### Returns
*(Observable)*: An observable sequence which fires on each 'data' event as well as handling 'error' and 'end' events.

#### Example
```js
var Rx = require('rx');

var subscription = Rx.Node.fromStream(process.stdin)
    .subscribe(function (x) { console.log(x); });

// => r<Buffer 72>
// => x<Buffer 78>
```

### Location

- rx.node.js

* * *

### <a id="rxnodewritetostreamobservable-stream-encoding"></a>`Rx.Node.writeToStream(observable, stream, [encoding])`
<a href="#rxnodewritetostreamobservable-stream-encoding">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.node.js#L162-L175 "View in source") 

Writes an observable sequence to a stream.

#### Arguments
1. `observable` *(Obsesrvable)*: Observable sequence to write to a stream.
2. `stream` *(Stream)*: The stream to write to.
3. `[encoding]` *(String)*: The encoding of the item to write.

#### Returns
*(Disposable)*: The subscription handle.

#### Example
```js
var Rx = require('Rx');

var source = Rx.Observable.range(0, 5);

var subscription = Rx.Node.writeToStream(source, process.stdout, 'utf8');

// => 012
```

### Location

- rx.node.js

* * *