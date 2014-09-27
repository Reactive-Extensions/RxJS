module('FromEventPattern');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    slice = Array.prototype.slice;

/** Fake DOM Element */
function FakeDOMStandardElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName;
    this.addEventListenerCalled = false;
    this.removeEventListenerCalled = false;
}

FakeDOMStandardElement.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] = handler;
    this.addEventListenerCalled = true;
};

FakeDOMStandardElement.prototype.removeEventListener = function (eventName, handler, useCapture) {
    delete this.listeners[eventName];
    this.removeEventListenerCalled = true;
};

FakeDOMStandardElement.prototype.trigger = function (eventName) {
    var args = slice.call(arguments, 1);
    if (eventName in this.listeners) {
        this.listeners[eventName].apply(null, args);
    }
};

test('Event_1', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEventPattern(
        function (h) { element.addEventListener('someEvent', h, false); },
        function (h) { element.removeEventListener('someEvent', h, false); }
    );

    var d = Observable.fromEvent(element, 'someEvent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    element.trigger('someEvent', 42);
    equal(element.addEventListenerCalled, true);
    equal(element.removeEventListenerCalled, false);

    d.dispose();

    equal(element.removeEventListenerCalled, true);
});

test('Event_2', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEventPattern(
            function (h) { element.addEventListener('someEvent', h, false); },
            function (h) { element.removeEventListener('someEvent', h, false); },
            function (arr) {
                return { foo: arr[0], bar: arr[1] };
            }
        )
        .subscribe(function (x) {
            equal(x.foo, 'baz');
            equal(x.bar, 'quux');
        });

    element.trigger('someEvent', 'baz', 'quux');
    equal(element.addEventListenerCalled, true);
    equal(element.removeEventListenerCalled, false);

    d.dispose();

    equal(element.removeEventListenerCalled, true);
});
