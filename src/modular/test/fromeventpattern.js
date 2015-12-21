'use strict';

var test = require('tape');
var Observable = require('../observable');
var slice = Array.prototype.slice;
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError;

Observable.addToObject({
  fromEventPattern: require('../observable/fromeventpattern')
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

test('fromEventPattern with return from add handler', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeDojoElement('foo');

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.onCalled, true);
    t.equal(element.offCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 42);
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEventPattern(
      function (h) { return element.on('someEvent', h); },
      function (_, d) { d.disconnect(); }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 42)
  ]);

  t.equal(element.offCalled, true);

  t.end();
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

test('Observable.fromEventPattern', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeDOMStandardElement('foo');

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addEventListenerCalled, true);
    t.equal(element.removeEventListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 42);
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEventPattern(
      function (h) { element.addEventListener('someEvent', h); },
      function (h) { element.removeEventListener('someEvent', h); }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 42)
  ]);

  t.equal(element.removeEventListenerCalled, true);

  t.end();
});

test('fromEventPattern selector', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeDOMStandardElement('foo');

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addEventListenerCalled, true);
    t.equal(element.removeEventListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEventPattern(
      function (h) { element.addEventListener('someEvent', h); },
      function (h) { element.removeEventListener('someEvent', h); },
      function (baz, quux) {
        return { foo: baz, bar: quux };
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, {foo: 'baz', bar: 'quux'})
  ]);

  t.equal(element.removeEventListenerCalled, true);

  t.end();
});

test('fromEventPattern selector throws', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var element = new FakeDOMStandardElement('foo');

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addEventListenerCalled, true);
    t.equal(element.removeEventListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEventPattern(
      function (h) { element.addEventListener('someEvent', h); },
      function (h) { element.removeEventListener('someEvent', h); },
      function () {
        throw error;
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.equal(element.removeEventListenerCalled, true);

  t.end();
});
