'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var never = require('./never');
var inherits = require('util').inherits;

var LEFT_CHOICE = 'L';
var RIGHT_CHOICE = 'R';

function choiceL(state) {
  if (!state.choice) {
    state.choice = LEFT_CHOICE;
    state.rightSubscription.dispose();
  }
}

function choiceR(state) {
  if (!state.choice) {
    state.choice = RIGHT_CHOICE;
    state.leftSubscription.dispose();
  }
}

function LeftObserver(o, state) {
  this._o = o;
  this._s = state;
  AbstractObserver.call(this);
}

inherits(LeftObserver, AbstractObserver);

LeftObserver.prototype.next = function (x) {
  choiceL(this._s);
  this._s.choice === LEFT_CHOICE && this._o.onNext(x);
};

LeftObserver.prototype.error = function (e) {
  choiceL(this._s);
  this._s.choice === LEFT_CHOICE && this._o.onError(e);
};

LeftObserver.prototype.completed = function () {
  choiceL(this._s);
  this._s.choice === LEFT_CHOICE && this._o.onCompleted();
};

function RightObserver(o, state) {
  this._o = o;
  this._s = state;
  AbstractObserver.call(this);
}

inherits(RightObserver, AbstractObserver);

RightObserver.prototype.next = function (x) {
  choiceR(this._s);
  this._s.choice === RIGHT_CHOICE && this._o.onNext(x);
};

RightObserver.prototype.error = function (e) {
  choiceR(this._s);
  this._s.choice === RIGHT_CHOICE && this._o.onError(e);
};

RightObserver.prototype.completed = function () {
  choiceR(this._s);
  this._s.choice === RIGHT_CHOICE && this._o.onCompleted();
};

function AmbObservable (leftSource, rightSource) {
  isPromise(leftSource) && (leftSource = fromPromise(leftSource));
  isPromise(rightSource) && (rightSource = fromPromise(rightSource));

  this._l = leftSource;
  this._r = rightSource;
  ObservableBase.call(this);
}

inherits(AmbObservable, ObservableBase);

AmbObservable.prototype.subscribeCore = function (o) {
  var state = {
    choice: null,
    leftSubscription: new SingleAssignmentDisposable(),
    rightSubscription: new SingleAssignmentDisposable()
  };

  state.leftSubscription.setDisposable(this._l.subscribe(new LeftObserver(o, state)));
  state.rightSubscription.setDisposable(this._r.subscribe(new RightObserver(o, state)));

  return new BinaryDisposable(state.leftSubscription, state.rightSubscription);
};

/**
 * Propagates the observable sequence or Promise that reacts first.
 * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
 */
module.exports = function amb() {
  var acc = never();
  for (var i = 0, len = arguments.length; i < len; i++) { acc = new AmbObservable(acc, arguments[i]); }
  return acc;
};
