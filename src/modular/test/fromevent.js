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
  fromEvent: require('../observable/fromevent')
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

test('Observable.fromEvent DOM Element', function (t) {
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
    return Observable.fromEvent(element, 'someEvent');
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 42)
  ]);

  t.equal(element.removeEventListenerCalled, true);

  t.end();
});

test('Observable.fromEvent DOM Element selector', function (t) {
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
    return Observable.fromEvent(
      element,
      'someEvent',
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

test('Observable.fromEvent DOM Element selector throws', function (t) {
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
    return Observable.fromEvent(
      element,
      'someEvent',
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

test('Observable.fromEvent EventEmitter', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeEventEmitter();

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addListenerCalled, true);
    t.equal(element.removeListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.emit('someEvent', 42);
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEvent(element, 'someEvent');
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 42)
  ]);

  t.equal(element.removeListenerCalled, true);

  t.end();
});

test('Observable.fromEvent EventEmitter selector', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeEventEmitter();

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addListenerCalled, true);
    t.equal(element.removeListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.emit('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEvent(
      element,
      'someEvent',
      function (baz, quux) {
        return { foo: baz, bar: quux };
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, {foo: 'baz', bar: 'quux'})
  ]);

  t.equal(element.removeListenerCalled, true);

  t.end();
});

test('Observable.fromEvent EventEmitter selector throws', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var element = new FakeEventEmitter();

  scheduler.scheduleFuture(null, 210, function() {
    t.equal(element.addListenerCalled, true);
    t.equal(element.removeListenerCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.emit('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEvent(
      element,
      'someEvent',
      function () {
        throw error;
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.equal(element.removeListenerCalled, true);

  t.end();
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

test('Observable.fromEvent jQuery/Angular/Ember Element', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeJQueryElement('foo');

  scheduler.scheduleFuture(null, 210, function(){
    t.equal(element.onCalled, true);
    t.equal(element.offCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 42);
  });

  var results = scheduler.startScheduler(function() {
    return Observable.fromEvent(element, 'someEvent');
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 42)
  ]);

  t.equal(element.offCalled, true);

  t.end();
});

test('Observable.fromEvent jQuery/Angular/Ember Element selector', function (t) {
  var scheduler = new TestScheduler();

  var element = new FakeJQueryElement('foo');

  scheduler.scheduleFuture(null, 210, function(){
    t.equal(element.onCalled, true);
    t.equal(element.offCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function(){
    return Observable.fromEvent(
      element,
      'someEvent',
      function (baz, quux) {
        return { foo: baz, bar: quux };
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, {foo: 'baz', bar: 'quux'})
  ]);

  t.equal(element.offCalled, true);

  t.end();
});

test('Observable.fromEvent jQuery/Angular/Ember Element selector throws', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var element = new FakeJQueryElement('foo');

  scheduler.scheduleFuture(null, 210, function(){
    t.equal(element.onCalled, true);
    t.equal(element.offCalled, false);
  });

  scheduler.scheduleFuture(null, 220, function() {
    element.trigger('someEvent', 'baz', 'quux');
  });

  var results = scheduler.startScheduler(function(){
    return Observable.fromEvent(
      element,
      'someEvent',
      function () {
        throw error;
      }
    );
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.equal(element.offCalled, true);

  t.end();
});
