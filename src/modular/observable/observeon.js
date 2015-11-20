'use strict';

var ObservableBase = require('./observablebase');
var ObserveOnObserver = require('../observer/observeonobserver');
var inherits = require('util').inherits;

function ObserveOnObservable(source, s) {
  this.source = source;
  this._s = s;
  ObservableBase.call(this);
}

inherits(ObserveOnObservable, ObservableBase);

ObserveOnObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new ObserveOnObserver(this._s, o));
};

module.exports = function observeOn (source, scheduler) {
  return new ObserveOnObservable(source, scheduler);
};
