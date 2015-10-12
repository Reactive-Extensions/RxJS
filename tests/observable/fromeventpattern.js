(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  var Observable = Rx.Observable,
    slice = Array.prototype.slice,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError;

  QUnit.module('fromEventPattern', {
    setup : function() {
      this.scheduler = new Rx.TestScheduler();
    }
  });

  function FakeDojoElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName;
    this.onCalled = false;
    this.offCalled = false;
  }

  FakeDojoElement.prototype.on = function (eventName, handler) {
    this.listeners[eventName] = handler;
    this.onCalled = true;
    return new FakeDojoDisposable(this, eventName);
  };

  FakeDojoElement.prototype.trigger = function (eventName) {
    var args = slice.call(arguments, 1);
    if (eventName in this.listeners) {
      this.listeners[eventName].apply(null, args);
    }
  };

  function FakeDojoDisposable(parent, eventName) {
    this.parent = parent;
    this.eventName = eventName;
  }

  FakeDojoDisposable.prototype.disconnect = function () {
    delete this.parent.listeners[this.eventName];
    this.parent.offCalled = true;
  };

  test('fromEventPattern with return from add handler', function () {
    var element = new FakeDojoElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.onCalled, true);
      equal(element.offCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 42);
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEventPattern(
        function (h) { return element.on('someEvent', h); },
        function (_, d) { d.disconnect(); }
      );
    });

    result.messages.assertEqual(onNext(220, 42));

    equal(element.offCalled, true);
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

  test('fromEventPattern', function () {
    var element = new FakeDOMStandardElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 42);
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEventPattern(
        function (h) { element.addEventListener('someEvent', h); },
        function (h) { element.removeEventListener('someEvent', h); }
      );
    });

    result.messages.assertEqual(onNext(220, 42));

    equal(element.removeEventListenerCalled, true);
  });

  test('fromEventPattern selector', function () {
    var element = new FakeDOMStandardElement('foo');

    this.scheduler.scheduleFuture(null, 210, function() {
      equal(element.addEventListenerCalled, true);
      equal(element.removeEventListenerCalled, false);
    });

    this.scheduler.scheduleFuture(null, 220, function() {
      element.trigger('someEvent', 'baz', 'quux');
    });

    var result = this.scheduler.startScheduler(function() {
      return Observable.fromEventPattern(
        function (h) { element.addEventListener('someEvent', h); },
        function (h) { element.removeEventListener('someEvent', h); },
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

  test('fromEventPattern selector throws', function () {
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
      return Observable.fromEventPattern(
        function (h) { element.addEventListener('someEvent', h); },
        function (h) { element.removeEventListener('someEvent', h); },
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

}());
