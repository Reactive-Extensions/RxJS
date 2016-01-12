'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var CompositeDisposable = require('../compositedisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');

function InnerObserver(parent, sad) {
  this._parent = parent;
  this._sad = sad;
  AbstractObserver.call(this);
}

inherits(InnerObserver, AbstractObserver);

InnerObserver.prototype.next = function (x) { this._parent._o.onNext(x); };
InnerObserver.prototype.error = function (e) { this._parent._o.onError(e); };
InnerObserver.prototype.completed = function () {
  this._parent._g.remove(this._sad);
  this._parent._done && this._parent._g.length === 1 && this._parent._o.onCompleted();
};

function MergeAllObserver(o, g) {
  this._o = o;
  this._g = g;
  this._done = false;
  AbstractObserver.call(this);
}

inherits(MergeAllObserver, AbstractObserver);

MergeAllObserver.prototype.next = function(innerSource) {
  var sad = new SingleAssignmentDisposable();
  this._g.add(sad);
  isPromise(innerSource) && (innerSource = fromPromise(innerSource));
  sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
};
MergeAllObserver.prototype.error = function (e) { this._o.onError(e); };
MergeAllObserver.prototype.completed = function () { this._done = true; this._g.length === 1 && this._o.onCompleted(); };


function MergeAllObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(MergeAllObservable, ObservableBase);

MergeAllObservable.prototype.subscribeCore = function (o) {
  var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
  g.add(m);
  m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
  return g;
};

/**
* Merges an observable sequence of observable sequences into an observable sequence.
* @returns {Observable} The observable sequence that merges the elements of the inner sequences.
*/
module.exports = function mergeAll (sources) {
  return new MergeAllObservable(sources);
};
