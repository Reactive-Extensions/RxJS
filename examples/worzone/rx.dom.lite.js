;(function (factory) {
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  var root = (objectTypes[typeof window] && window) || this,
  freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
  freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
  moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
  freeGlobal = objectTypes[typeof global] && global;

  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  // Because of build optimizers
  if (typeof define === 'function' && define.amd) {
    define(['rx'], function (Rx, exports) {
      return factory(root, exports, Rx);
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('./rx'));
  } else {
    root.dom = factory(root, {}, root.Rx);
  }
}.call(this, function (root, exp, Rx, undefined) {

  // Header values
  var AnonymousObservable = Rx.AnonymousObservable;

  function noop () { }

  var dom = {
    ready: function () {
      return new AnonymousObservable(function (observer) {
        function handler () {
          observer.onNext();
          observer.onCompleted();
        }
        function createListener() {
          if (document.addEventListener) {
            document.addEventListener( 'DOMContentLoaded', handler, false );
            root.addEventListener( 'load', handler, false );
            return function () {
              document.removeEventListener( 'DOMContentLoaded', handler, false );
              root.removeEventListener( 'load', handler, false );
            };
          } else if (document.attachEvent) {
            document.attachEvent( 'onDOMContentLoaded', handler );
            root.attachEvent( 'onload', handler );
            return function () {
              document.attachEvent( 'DOMContentLoaded', handler );
              root.attachEvent( 'load', handler );
            };
          } else {
            document['onload'] = handler;
            root['onDOMContentLoaded'] = handler;
            return function () {
              document['onload'] = null;
              root['onDOMContentLoaded'] = null;
            };
          }
        }
        var returnFn = noop;
        if (document.readyState === "complete") {
          setTimeout(handler, 0);
        } else {
          returnFn = createListener();
        }
        return returnFn;
      }).publish().refCount();
    }
  };

  return dom;
}));
