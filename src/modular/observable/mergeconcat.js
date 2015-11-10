'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var CompositeDisposable = require('../compositedisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('util').inherits;

function InnerObserver(parent, sad) {
  this._p = parent;
  this._sad = sad;
  AbstractObserver.call(this);
}

inherits(InnerObserver, AbstractObserver);

InnerObserver.prototype.next = function (x) { this._p._o.onNext(x); };
InnerObserver.prototype.error = function (e) { this._p._o.onError(e); };
InnerObserver.prototype.completed = function () {
  this._p._g.remove(this._sad);
  if (this._p._q.length > 0) {
    this._p.handleSubscribe(this._p._q.shift());
  } else {
    this._p._activeCount--;
    this._p._done && this._p._activeCount === 0 && this._p._o.onCompleted();
  }
};

function MergeObserver(o, max, g) {
  this._o = o;
  this._max = max;
  this._g = g;
  this._done = false;
  this._q = [];
  this._activeCount = 0;
  AbstractObserver.call(this);
}

inherits(MergeObserver, AbstractObserver);

MergeObserver.prototype.handleSubscribe = function (xs) {
  var sad = new SingleAssignmentDisposable();
  this._g.add(sad);
  isPromise(xs) && (xs = fromPromise(xs));
  sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
};

MergeObserver.prototype.next = function (innerSource) {
  if(this._activeCount < this._max) {
    this._activeCount++;
    this.handleSubscribe(innerSource);
  } else {
    this._q.push(innerSource);
  }
};
MergeObserver.prototype.error = function (e) { this._o.onError(e); };
MergeObserver.prototype.completed = function () { this._done = true; this._activeCount === 0 && this._o.onCompleted(); };


function MergeObservable(source, maxConcurrent) {
  this.source = source;
  this._maxConcurrent = maxConcurrent;
  ObservableBase.call(this);
}

inherits(MergeObservable, ObservableBase);

MergeObservable.prototype.subscribeCore = function(observer) {
  var g = new CompositeDisposable();
  g.add(this.source.subscribe(new MergeObserver(observer, this._maxConcurrent, g)));
  return g;
};

/**
* Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
* Or merges two observable sequences into a single observable sequence.
* @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
* @returns {Observable} The observable sequence that merges the elements of the inner sequences.
*/
module.exports = function mergeConcat (source, maxConcurrent) {
  return new MergeObservable(source, maxConcurrent);
};
