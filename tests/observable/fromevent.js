(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  var Observable = Rx.Observable,
    slice = Array.prototype.slice,
    onNext = Rx.ReactiveTest.onNext;

  QUnit.module('FromEvent', {
    setup : function() {
      this.scheduler = new Rx.TestScheduler();
    }
  });



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

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 42);
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(element, 'someEvent');
    });

    result.messages.assertEqual(onNext(220, 42));

    equal(element.removeEventListenerCalled, true);
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

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addListenerCalled, true);
      equal(element.removeListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.emit('someEvent', 42);
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(element, 'someEvent');
    });

    result.messages.assertEqual(onNext(220, 42));
    equal(element.removeListenerCalled, true);
  });

  test('Event_4', function () {
    var scheduler = new Rx.TestScheduler();
    var element = new FakeDOMStandardElement('foo');

    scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    var result = scheduler.startScheduler(function() {
      return Observable.fromEvent(
        element,
        'someEvent',
        function (baz, quux) {
          return { foo: baz, bar: quux };
        }
      );
    });

    result.messages.assertEqual(
      onNext(220, function(x) {
        equal(x.value.foo, 'baz');
        equal(x.value.bar, 'quux');
        return true;
      })
    );

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

  test('Event_5', function () {
    var element = new FakeJQueryElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.onCalled, true);
      equal(element.offCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 42);
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(element, 'someEvent');
    });

    result.messages.assertEqual(
      onNext(220, 42)
    );

    equal(element.offCalled, true);
  });

  test('Event_6', function () {
    var element = new FakeJQueryElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    this.scheduler.scheduleFuture(null, 220, function(){
      equal(element.onCalled, true);
      equal(element.offCalled, false);
    });

    var result = this.scheduler.startScheduler(function(){
      return Observable.fromEvent(
        element,
        'someEvent',
        function (baz, quux) {
          return { foo: baz, bar: quux };
        }
      );
    });

    result.messages.assertEqual(
      onNext(210, function(x) {
        equal(x.value.foo, 'baz');
        equal(x.value.bar, 'quux');
        return true;
      })
    );

    equal(element.offCalled, true);
  });

}());
