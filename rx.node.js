var Rx = require('./rx');
require('./rx.aggregates');
require('./rx.async');
require('./rx.binding');
require('./rx.coincidence');
require('./rx.experimental');
require('./rx.joinpatterns');
require('./rx.time');
require('./rx.virtualtime');
require('./rx.testing');

// Add specific Node functions
var EventEmitter = require('events').EventEmitter,
    Observable = Rx.Observable;

Rx.Node = {
    /**
     * @deprecated Use Rx.Observable.fromCallback from rx.async.js instead.
     *
     * Converts a callback function to an observable sequence. 
     * 
     * @param {Function} function Function to convert to an asynchronous function.
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} Asynchronous function.
     */
    fromCallback: function (func, scheduler, context) {
        return Observable.fromCallback(func, scheduler, context);
    },

    /**
     * @deprecated Use Rx.Observable.fromNodeCallback from rx.async.js instead.
     *
     * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
     *
     * @param {Function} func The function to call
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
     */
    fromNodeCallback: function (func, scheduler, context) {
        return Observable.fromNodeCallback(func, scheduler, context);
    },

    /**
     * @deprecated Use Rx.Observable.fromEvent from rx.async.js instead.
     *
     * Handles an event from the given EventEmitter as an observable sequence.
     *
     * @param {EventEmitter} eventEmiiter The EventEmitter to subscribe to the given event.
     * @param {String} eventName The event name to subscribe
     * @returns {Observable} An observable sequence generated from the named event from the given EventEmitter.
     */
    fromEvent: function (eventEmitter, eventName) {
        return Observable.fromEvent(eventEmitter, eventName);
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

        // Used to publish the events from the observable
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
        return Observable.create(function (observer) {
            function dataHandler (data) {
                observer.onNext(data);
            }

            function errorHandler (err) {
                observer.onError(err);
            }

            function endHandler () {
                observer.onCompleted();
            }

            stream.addListener('data', dataHandler);
            stream.addListener('error', errorHandler);
            stream.addListener('end', endHandler);
            
            return function () {
                stream.removeListener('data', dataHandler);
                stream.removeListener('error', errorHandler);
                stream.removeListener('end', endHandler);
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
