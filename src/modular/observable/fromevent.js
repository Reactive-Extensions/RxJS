'use strict';

var ObservableBase = require('./observablebase');
var fromEventPattern = require('./fromeventpattern');
var publish = require('./publish');
var CompositeDisposable = require('../compositedisposable');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function isNodeList(el) {
  if (global.StaticNodeList) {
    // IE8 Specific
    // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
    return el instanceof global.StaticNodeList || el instanceof global.NodeList;
  } else {
    return Object.prototype.toString.call(el) === '[object NodeList]';
  }
}

function ListenDisposable(e, n, fn) {
  this._e = e;
  this._n = n;
  this._fn = fn;
  this._e.addEventListener(this._n, this._fn, false);
  this.isDisposed = false;
}

ListenDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this._e.removeEventListener(this._n, this._fn, false);
    this.isDisposed = true;
  }
};

function createEventListener (el, eventName, handler) {
  var disposables = new CompositeDisposable();

  // Asume NodeList or HTMLCollection
  var elemToString = Object.prototype.toString.call(el);
  if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
    for (var i = 0, len = el.length; i < len; i++) {
      disposables.add(createEventListener(el.item(i), eventName, handler));
    }
  } else if (el) {
    disposables.add(new ListenDisposable(el, eventName, handler));
  }

  return disposables;
}

/**
 * Configuration option to determine whether to use native events only
 */
global._Rx || (global._Rx = {});
global._Rx.config || (global._Rx.config = {});
global._Rx.config.useNativeEvents = false;

function EventObservable(el, name, fn) {
  this._el = el;
  this._n = name;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(EventObservable, ObservableBase);

function createHandler(o, fn) {
  return function handler () {
    var results = arguments[0];
    if (isFunction(fn)) {
      results = tryCatch(fn).apply(null, arguments);
      if (results === global._Rx.errorObj) { return o.onError(results.e); }
    }
    o.onNext(results);
  };
}

EventObservable.prototype.subscribeCore = function (o) {
  return createEventListener(
    this._el,
    this._n,
    createHandler(o, this._fn));
};

/**
 * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
 * @param {Object} element The DOMElement or NodeList to attach a listener.
 * @param {String} eventName The event name to attach the observable sequence.
 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
 * @returns {Observable} An observable sequence of events from the specified element and the specified event.
 */
module.exports = function fromEvent(element, eventName, selector) {
  // Node.js specific
  if (element.addListener) {
    return fromEventPattern(
      function (h) { element.addListener(eventName, h); },
      function (h) { element.removeListener(eventName, h); },
      selector);
  }

  // Use only if non-native events are allowed
  if (!global._Rx.config.useNativeEvents) {
    // Handles jq, Angular.js, Zepto, Marionette, Ember.js
    if (typeof element.on === 'function' && typeof element.off === 'function') {
      return fromEventPattern(
        function (h) { element.on(eventName, h); },
        function (h) { element.off(eventName, h); },
        selector);
    }
  }

  return publish(new EventObservable(element, eventName, selector)).refCount();
};
