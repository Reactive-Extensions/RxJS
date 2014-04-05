module('FromEvent');

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

function FakeNodeList(arr) {
    this.arr = arr;
    this.length = arr.length;
}
FakeNodeList.prototype.item = function (index) {
    return this.arr[index];
}

test('Event_2', function () {
    var elements = new FakeNodeList([new FakeDOMStandardElement('foo')]);

    var d = Observable.fromEvent(elements, 'someEvent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    elements.item(0).trigger('someEvent', 42);
    equal(elements.item(0).addEventListenerCalled, true);
    equal(elements.item(0).removeEventListenerCalled, false);    

    d.dispose();

    equal(elements.item(0).removeEventListenerCalled, true);    
});

/** Fake DOM Element */
function FakeEventEmitter() {
    this.listeners = {};
    this.addListenerCalled = false;
    this.removeListenerCalled = false;
}

FakeEventEmitter.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] = handler;
    this.addListenerCalled = true;
};

FakeEventEmitter.prototype.removeEventListener = function (eventName, handler, useCapture) {
    delete this.listeners[eventName];
    this.removeListenerCalled = true;
};

FakeEventEmitter.prototype.emit = function (eventName, eventData) {
    if (eventName in this.listeners) {
        this.listeners[eventName](eventData);
    }
};

test('Event_3', function () {
    var element = new FakeEventEmitter();

    var d = Observable.fromEvent(element, 'someEvent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    element.emit('someEvent', 42);
    equal(element.addListenerCalled, true);
    equal(element.removeListenerCalled, false);

    d.dispose();

    equal(element.removeListenerCalled, true);
});

test('Event_4', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEvent(
            element, 
            'someEvent',
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