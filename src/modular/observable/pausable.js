'use strict';

var Observable = require('../observable');
var distinctUntilChanged = require('./distinctuntilchanged');
var merge = require('./merge');
var publish = require('./publish');
var Subject = require('../subject');
var Disposable = require('../disposable');
var NAryDisposable = require('../narydisposable');
var inherits = require('inherits');

function PausableObservable(source, pauser) {
  this.source = source;
  this.controller = new Subject();

  if (pauser && pauser.subscribe) {
    this.pauser = merge(this.controller, pauser);
  } else {
    this.pauser = this.controller;
  }

  Observable.call(this);
}

inherits(PausableObservable, Observable);

PausableObservable.prototype._subscribe = function (o) {
  var conn = publish(this.source),
    subscription = conn.subscribe(o),
    connection = Disposable.empty;

  var pausable = distinctUntilChanged(this.pauser).subscribe(function (b) {
    if (b) {
      connection = conn.connect();
    } else {
      connection.dispose();
      connection = Disposable.empty;
    }
  });

  return new NAryDisposable([subscription, connection, pausable]);
};

PausableObservable.prototype.pause = function () {
  this.controller.onNext(false);
};

PausableObservable.prototype.resume = function () {
  this.controller.onNext(true);
};

module.exports = function pausable (source, pauser) {
  return new PausableObservable(source, pauser);
};
