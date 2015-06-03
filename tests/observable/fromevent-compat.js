(function () {
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

  /** Fake DOM Element */
  function FakeDOMIEElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName
    this.attachEventCalled = false;
    this.detachEventCalled = false;
  }

  FakeDOMIEElement.prototype.attachEvent = function (eventName, handler) {
    this.listeners[eventName] = handler;
    this.attachEventCalled = true;
  };

  FakeDOMIEElement.prototype.detachEvent = function (eventName, handler) {
    delete this.listeners[eventName];
    this.detachEventCalled = true;
  };

  FakeDOMIEElement.prototype.trigger = function (eventName, eventData) {
    if (eventName in this.listeners) {
      this.listeners[eventName](eventData);
    }
  };

  test('Event_3', function () {
    var element = new FakeDOMIEElement('foo');

    var d = Observable.fromEvent(element, 'someevent')
    .subscribe(function (x) {
      equal(x, 42);
    });

    element.trigger('onsomeevent', 42);
    equal(element.attachEventCalled, true);
    equal(element.detachEventCalled, false);

    d.dispose();

    equal(element.detachEventCalled, true);
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

  test('Event_5', function () {
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

  test('Event_6', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEvent(
      element,
      'someEvent',
      function (baz, quux) {
        return { foo: baz, bar: quux };
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

  /** Fake DOM Element */
  function FakeJQueryElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName;
    this.onCalled = false;
    this.offCalled = false;
  }

  FakeJQueryElement.prototype.on = function (eventName, handler) {
    this.listeners[eventName] = handler;
    this.onCalled = true;
  };

  FakeJQueryElement.prototype.off = function (eventName, handler) {
    delete this.listeners[eventName];
    this.offCalled = true;
  };

  FakeJQueryElement.prototype.trigger = function (eventName) {
    var args = slice.call(arguments, 1);
    if (eventName in this.listeners) {
      this.listeners[eventName].apply(null, args);
    }
  };

  test('Event_7', function () {
    var element = new FakeJQueryElement('foo');

    var d = Observable.fromEvent(element, 'someEvent')
    .subscribe(function (x) {
      equal(x, 42);
    });

    element.trigger('someEvent', 42);
    equal(element.onCalled, true);
    equal(element.offCalled, false);

    d.dispose();

    equal(element.offCalled, true);
  });

  test('Event_8', function () {
    var element = new FakeJQueryElement('foo');

    var d = Observable.fromEvent(
      element,
      'someEvent',
      function (baz, quux) {
        return { foo: baz, bar: quux };
      }
    )
    .subscribe(function (x) {
      equal(x.foo, 'baz');
      equal(x.bar, 'quux');
    });

    element.trigger('someEvent', 'baz', 'quux');
    equal(element.onCalled, true);
    equal(element.offCalled, false);

    d.dispose();

    equal(element.offCalled, true);
  });

}());
