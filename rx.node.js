var Rx = require('./rx');
require('./rx.aggregates');
require('./rx.binding');
require('./rx.coincidence');
require('./rx.experimental');
require('./rx.joinpatterns');
require('./rx.time');
require('./rx.virtualtime');
require('./rx.testing');

// Add specific Node functions
var EventEmitter = require('events').EventEmitter,
    slice = Array.prototype.slice;

Rx.Node = {
    /**
     * Converts a callback function to an observable sequence. 
     * 
     * @param {Function} function Function to convert to an asynchronous function.
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} Asynchronous function.
     */
    fromCallback: function (func, scheduler, context) {
        scheduler || (scheduler = Rx.Scheduler.timeout);
        return function () {
            var args = slice.call(arguments, 0), 
                subject = new Rx.AsyncSubject();

            scheduler.schedule(function () {
                function handler() {
                    subject.onNext(arguments);
                    subject.onCompleted();
                }

                args.push(handler);
                func.apply(context, args);
            });

            return subject.asObservable();
        };
    },

    /**
     * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
     * @param {Function} func The function to call
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
     */
    fromNodeCallback: function (func, scheduler, context) {
        scheduler || (scheduler = Rx.Scheduler.timeout);
        return function () {
            var args = slice.call(arguments, 0), 
                subject = new Rx.AsyncSubject();

            scheduler.schedule(function () {
                function handler(err) {
                    var handlerArgs = slice.call(arguments, 1);

                    if (err) {
                        subject.onError(err);
                        return;
                    }

                    subject.onNext(handlerArgs);
                    subject.onCompleted();
                }

                args.push(handler);
                func.apply(context, args);
            });

            return subject.asObservable();
        };
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
        }).publish().refCount();
    },

    /**
     * Converts the given observable sequence to an event emitter with the given event name. 
     * The errors are handled on the 'error' event and completion on the 'end' event.
     * @param {Observable} The observable sequence to convert to an EventEmitter.
     * @param {String} eventName The event name to emit onNext calls.
     * @returns {EventEmitter} An EventEmitter which emits the given eventName for each onNext call in addition to 'error' and 'end' events.  
     *   You must call publish in order to invoke the subscription on the Observable sequuence.
     */
    toEventEmitter: function (observable, eventName) {
        var e = new EventEmitter();

        e.publish = function () {
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
        };

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
        }).publish().refCount();
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
                stream.write(String(x), encoding);
            },
            function (err) {
                stream.emit('error', err);
            }, function () {
                // Hack check because STDIO is not closable
                if (!stream._isStdio) {
                    stream.end();
                }
            });
    }
};

module.exports = Rx;
