(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  var Observable = Rx.Observable,
    slice = Array.prototype.slice,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError;

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

  test('Event DOM Element', function () {
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

  test('Event DOM Element selector', function () {
    var element = new FakeDOMStandardElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(
        element,
        'someEvent',
        function (baz, quux) {
          return { foo: baz, bar: quux };
        }
      );
    });

    result.messages.assertEqual(
      onNext(220, {foo: 'baz', bar: 'quux'})
    );

    equal(element.removeEventListenerCalled, true);
  });

  test('Event DOM Element selector throws', function () {
    var error = new Error();

    var element = new FakeDOMStandardElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(
        element,
        'someEvent',
        function () {
          throw error;
        }
      );
    });

    result.messages.assertEqual(
      onError(220, error)
    );

    equal(element.removeEventListenerCalled, true);
  });

  /** Fake Node EventEmitter */
  function FakeEventEmitter() {
    this.listeners = {};
    this.addListenerCalled = false;
    this.removeListenerCalled = false;
  }

  FakeEventEmitter.prototype.addListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] = handler;
    this.addListenerCalled = true;
  };

  FakeEventEmitter.prototype.removeListener = function (eventName, handler, useCapture) {
    delete this.listeners[eventName];
    this.removeListenerCalled = true;
  };

  FakeEventEmitter.prototype.emit = function (eventName, eventData) {
    var args = slice.call(arguments, 1);
    if (eventName in this.listeners) {
      this.listeners[eventName].apply(null, args);
    }
  };

  test('Event EventEmitter', function () {
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

  test('Event EventEmitter selector', function () {
    var element = new FakeEventEmitter();

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addListenerCalled, true);
      equal(element.removeListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.emit('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(
        element,
        'someEvent',
        function (baz, quux) {
          return { foo: baz, bar: quux };
        }
      );
    });

    result.messages.assertEqual(
      onNext(220, {foo: 'baz', bar: 'quux'})
    );

    equal(element.removeListenerCalled, true);
  });

  test('Event EventEmitter selector throws', function () {
    var error = new Error();

    var element = new FakeEventEmitter();

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addListenerCalled, true);
      equal(element.removeListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.emit('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEvent(
        element,
        'someEvent',
        function () {
          throw error;
        }
      );
    });

    result.messages.assertEqual(
      onError(220, error)
    );

    equal(element.removeListenerCalled, true);
  });

  /** Fake jQuery/Angular/Ember Element */
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

  test('Event jQuery/Angular/Ember Element', function () {
    var element = new FakeJQueryElement('foo');

    this.scheduler.scheduleFuture(null, 210, function(){
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

  test('Event jQuery/Angular/Ember Element selector', function () {
    var element = new FakeJQueryElement('foo');

    this.scheduler.scheduleFuture(null, 210, function(){
      equal(element.onCalled, true);
      equal(element.offCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
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
      onNext(220, {foo: 'baz', bar: 'quux'})
    );

    equal(element.offCalled, true);
  });

  test('Event jQuery/Angular/Ember Element selector throws', function () {
    var error = new Error();

    var element = new FakeJQueryElement('foo');

    this.scheduler.scheduleFuture(null, 210, function(){
      equal(element.onCalled, true);
      equal(element.offCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function(){
      return Observable.fromEvent(
        element,
        'someEvent',
        function () {
          throw error;
        }
      );
    });

    result.messages.assertEqual(
      onError(220, error)
    );

    equal(element.offCalled, true);
  });

}());
