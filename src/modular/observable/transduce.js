'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function TransduceObserver(o, xform) {
  this._o = o;
  this._xform = xform;
  AbstractObserver.call(this);
}

inherits(TransduceObserver, AbstractObserver);

TransduceObserver.prototype.next = function (x) {
  var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
  if (res === global._Rx.errorObj) { this._o.onError(res.e); }
};

TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

TransduceObserver.prototype.completed = function () {
  this._xform['@@transducer/result'](this._o);
};

function transformForObserver(o) {
  return {
    '@@transducer/init': function() {
      return o;
    },
    '@@transducer/step': function(obs, input) {
      return obs.onNext(input);
    },
    '@@transducer/result': function(obs) {
      return obs.onCompleted();
    }
  };
}

function TransduceObservable(source, transducer) {
  this.source = source;
  this._transducer = transducer;
  ObservableBase.call(this);
}

inherits(TransduceObservable, ObservableBase);

TransduceObservable.prototype.subscribeCore = function (o) {
  var xform = this._transducer(transformForObserver(o));
  return this.source.subscribe(new TransduceObserver(o, xform));
};

module.exports = function transduce (source, transducer) {
  return new TransduceObservable(source, transducer);
};
