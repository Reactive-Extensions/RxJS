// Defaults
var
  noop = Rx.helpers.noop = function () { },
  defaultNow = Rx.helpers.defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }()),
  defaultError = Rx.helpers.defaultError = function (err) { throw err; },
  isPromise = Rx.helpers.isPromise = function (p) { return !!p && !isFunction(p.subscribe) && isFunction(p.then); },
  isFunction = Rx.helpers.isFunction = (function () {
    var isFn = function (value) {
      return typeof value == 'function' || false;
    }

    // fallback for older versions of Chrome and Safari
    if (isFn(/x/)) {
      isFn = function(value) {
        return typeof value == 'function' && toString.call(value) == '[object Function]';
      };
    }
    return isFn;
  }());

  var NotImplementedError = Rx.NotImplementedError = function (message) {
    this.message = message || 'This operation is not implemented';
    Error.call(this);
  };
  NotImplementedError.prototype = Error.prototype;

  var notImplemented = Rx.helpers.notImplemented = function () {
    throw new NotImplementedError();
  };
