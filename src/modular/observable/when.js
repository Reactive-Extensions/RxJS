'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var throwError = require('./throw');
var CompositeDisposable = require('../compositedisposable');
var inherits = require('inherits');

require('es6-map/implement');

function WhenObserver(map, o) {
  this._map = map;
  this._o = o;
  AbstractObserver.call(this);
}

inherits(WhenObserver, AbstractObserver);

WhenObserver.prototype.next = function (x) { this._o.onNext(x); };
WhenObserver.prototype.completed = function () { this._o.onCompleted(); };
WhenObserver.prototype.error = function (e) {
  this._map.forEach(function (v) { v.onError(e); });
  this._o.onError(e);
};

function WhenObservable(plans) {
  this._plans = plans;
  ObservableBase.call(this);
}

inherits(WhenObservable, ObservableBase);

WhenObservable.prototype.subscribeCore = function (o) {
  var activePlans = [],
      externalSubscriptions = new global.Map(),
      outObserver = new WhenObserver(externalSubscriptions, o);

  try {
    for (var i = 0, len = this._plans.length; i < len; i++) {
      activePlans.push(this._plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
        var idx = activePlans.indexOf(activePlan);
        activePlans.splice(idx, 1);
        activePlans.length === 0 && o.onCompleted();
      }));
    }
  } catch (e) {
    return throwError(e).subscribe(o);
  }
  var group = new CompositeDisposable();
  externalSubscriptions.forEach(function (joinObserver) {
    joinObserver.subscribe();
    group.add(joinObserver);
  });

  return group;
};

/**
 *  Joins together the results from several patterns.
 *
 *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
 *  @returns {Observable} Observable sequence with the results form matching several patterns.
 */
module.exports = function when() {
  var len = arguments.length, plans = new Array(len);
  for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
  return new WhenObservable(plans);
};
