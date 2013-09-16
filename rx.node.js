var Rx = require('./rx');
require('./rx.aggregates');
require('./rx.binding');
require('./rx.coincidence');
require('./rx.experimental');
require('./rx.joinpatterns');
require('./rx.testing');
require('./rx.time');

// Add specific Node functions
var EventEmitter = require('events').EventEmitter,
    slice = Array.prototype.slice;

Rx.Node = {
    /**
     * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
     * @param {Function} fn The function to call
     * @param {Arguments} var_args The arguments to the function
     * @returns {Observable} An observable sequence with the callback parameters as an array.
     */
    fromNodeCallback: function (fn) {
        var args = slice.call(arguments, 1);
        return Rx.Observable.create(function (observer) {
            function handler() {
                var handlerArgs = slice.call(arguments);
                // Check if first is error
                if (handlerArgs[0] instanceof Error) {
                    observer.onError(err);
                    return;
                }

                observer.onNext(handlerArgs.slice(1));
                observer.onCompleted();
            }

            args.push(handler);
            fn.apply(null, args);
        });
    },

    /**
     * Handles an event from the given EventEmitter as an observable sequence.
     * @param {EventEmitter} eventEmiiter The EventEmitter to subscribe to the given event.
     * @param {String} eventName The event name to subscribe
     * @returns {Observable} An observable sequence generated from the named event from the given EventEmitter.
     */
    fromEvent: function (eventEmitter, eventName) {
        return Rx.Observable.create(function (observer) {
            function handler () {
                observer.onNext(arguments);
            }

            eventEmitter.on(eventName, handler);

            return function () {
                eventEmitter.off(eventName, handler);
            }
        });
    },

    /**
     * Converts the given observable sequence to an event emitter with the given event name. 
     * The errors are handled on the 'error' event and completion on the 'end' event.
     * @param {Observable} The observable sequence to convert to an EventEmitter.
     * @param {String} eventName The event name to emit onNext calls.
     * @returns {EventEmitter} An EventEmitter which emits the given eventName for each onNext call in addition to 'error' and 'end' events.
     */
    toEventEmitter: function (observable, eventName) {
        var e = new EventEmitter();

        e.subscription = observable.subscribe(
            function (x) {
                e.emit(eventName, x);
            }, 
            function (err) {
                e.emit('error', err);
            },
            function () {
                e.emit('end');
            });

        return e;
    },

    /**
     * Converts a flowing stream to an Observable sequence.
     * @param {Stream} stream A stream to convert to a observable sequence.
     * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and 'end' events.
     */
    fromStream: function (stream) {
        return Rx.Observable.create(function (observer) {
            function dataHandler (data) {
                observer.onNext(data);
            }

            function errorHandler (err) {
                observer.onError(err);
            }

            function endHandler () {
                observer.onCompleted();
            }

            stream.on('data', dataHandler);
            stream.on('error', errorHandler);
            stream.on('end', endHandler);
            
            return function () {
                stream.off('data', dataHandler);
                stream.off('error', errorHandler);
                stream.off('end', endHandler);
            };
        });
    },

    /**
     * Writes an observable sequence to a stream
     * @param {Observable} observable Observable sequence to write to a stream.
     * @param {Stream} stream The stream to write to.
     * @param {String} [encoding] The encoding of the item to write.
     * @returns {Disposable} The subscription handle.
     */
    writeToStream: function (observable, stream, encoding) {
        return observable.subscribe(
            function (x) {
                stream.write(x, encoding);
            },
            function (err) {
                stream.emit('error', err);
            }, function () {
                stream.end();
            });
    }
};

module.exports = Rx;