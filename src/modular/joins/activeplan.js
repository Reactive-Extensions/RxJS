'use strict';

require('es6-map/implement');

function ActivePlan(joinObserverArray, onNext, onCompleted) {
  this._joinObserverArray = joinObserverArray;
  this._onNext = onNext;
  this._onCompleted = onCompleted;
  this._joinObservers = new global.Map();
  for (var i = 0, len = this._joinObserverArray.length; i < len; i++) {
    var joinObserver = this._joinObserverArray[i];
    this._joinObservers.set(joinObserver, joinObserver);
  }
}

ActivePlan.prototype.dequeue = function () {
  this._joinObservers.forEach(function (v) { v._queue.shift(); });
};

ActivePlan.prototype.match = function () {
  var i, len, hasValues = true;
  for (i = 0, len = this._joinObserverArray.length; i < len; i++) {
    if (this._joinObserverArray[i]._queue.length === 0) {
      hasValues = false;
      break;
    }
  }
  if (hasValues) {
    var firstValues = [],
        isCompleted = false;
    for (i = 0, len = this._joinObserverArray.length; i < len; i++) {
      firstValues.push(this._joinObserverArray[i]._queue[0]);
      this._joinObserverArray[i]._queue[0].kind === 'C' && (isCompleted = true);
    }
    if (isCompleted) {
      this._onCompleted();
    } else {
      this.dequeue();
      var values = [];
      for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
        values.push(firstValues[i].value);
      }
      this._onNext.apply(this, values);
    }
  }
};

module.exports = ActivePlan;
