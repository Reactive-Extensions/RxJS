  // Utilities
  var toString = Object.prototype.toString;
  var arrayClass = '[object Array]',
      funcClass = '[object Function]',
      stringClass = '[object String]';

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
      var T, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      var O = Object(this);
      var len = O.length >>> 0;

      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      if (arguments.length > 1) {
        T = thisArg;
      }

      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
  }

  var boxedString = Object('a'),
      splitString = boxedString[0] !== 'a' || !(0 in boxedString);
  if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
      var object = Object(this),
        self = splitString && toString.call(this) === stringClass ?
          this.split('') :
          object,
        length = self.length >>> 0,
        thisp = arguments[1];

      if (toString.call(fun) !== funcClass) {
        throw new TypeError(fun + ' is not a function');
      }

      for (var i = 0; i < length; i++) {
        if (i in self && !fun.call(thisp, self[i], i, object)) {
          return false;
        }
      }
      return true;
    };
  }

  if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
      var object = Object(this),
        self = splitString && toString.call(this) === stringClass ?
            this.split('') :
            object,
        length = self.length >>> 0,
        result = new Array(length),
        thisp = arguments[1];

      if (toString.call(fun) !== funcClass) {
        throw new TypeError(fun + ' is not a function');
      }

      for (var i = 0; i < length; i++) {
        if (i in self) {
          result[i] = fun.call(thisp, self[i], i, object);
        }
      }
      return result;
    };
  }

  if (!Array.prototype.filter) {
    Array.prototype.filter = function (predicate) {
      var results = [], item, t = new Object(this);
      for (var i = 0, len = t.length >>> 0; i < len; i++) {
        item = t[i];
        if (i in t && predicate.call(arguments[1], item, i, t)) {
          results.push(item);
        }
      }
      return results;
    };
  }

  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return toString.call(arg) === arrayClass;
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(searchElement) {
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }

  // Fix for Tessel
  if (!Object.prototype.propertyIsEnumerable) {
    Object.prototype.propertyIsEnumerable = function (key) {
      for (var k in this) { if (k === key) { return true; } }
      return false;
    };
  }

  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');

      return function(obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [], prop, i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }

  if (typeof Object.create !== 'function') {
    // Production steps of ECMA-262, Edition 5, 15.2.3.5
    // Reference: http://es5.github.io/#x15.2.3.5
    Object.create = (function() {
      function Temp() {}

      var hasOwn = Object.prototype.hasOwnProperty;

      return function (O) {
        if (typeof O !== 'object') {
          throw new TypeError('Object prototype may only be an Object or null');
        }

        Temp.prototype = O;
        var obj = new Temp();
        Temp.prototype = null;

        if (arguments.length > 1) {
          // Object.defineProperties does ToObject on its first argument.
          var Properties = Object(arguments[1]);
          for (var prop in Properties) {
            if (hasOwn.call(Properties, prop)) {
              obj[prop] = Properties[prop];
            }
          }
        }

        // 5. Return obj
        return obj;
      };
    })();
  }

  root.Element && root.Element.prototype.attachEvent && !root.Element.prototype.addEventListener && (function () {
    function addMethod(name, fn) {
      Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = fn;
    }

    addMethod('addEventListener', function (type, listener) {
      var target = this;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      target.attachEvent('on' + type, typeListeners.event = function (e) {
        e || (e = root.event);

        var documentElement = target.document &&
          target.document.documentElement ||
          target.documentElement ||
          { scrollLeft: 0, scrollTop: 0 };

        e.currentTarget = target;
        e.pageX = e.clientX + documentElement.scrollLeft;
        e.pageY = e.clientY + documentElement.scrollTop;

        e.preventDefault = function () {
          e.bubbledKeyCode = e.keyCode;
          if (e.ctrlKey) {
            try {
              e.keyCode = 0;
            } catch (e) { }
          }
          e.defaultPrevented = true;
          e.returnValue = false;
          e.modified = true;
          e.returnValue = false;
        };

        e.stopImmediatePropagation = function () {
          immediatePropagation = false;
          e.cancelBubble = true;
        };

        e.stopPropagation = function () {
          e.cancelBubble = true;
        };

        e.relatedTarget = e.fromElement || null;
        e.target = e.srcElement || target;
        e.timeStamp = +new Date();

        // Normalize key events
        switch(e.type) {
          case 'keypress':
            var c = ('charCode' in e ? e.charCode : e.keyCode);
            if (c === 10) {
              c = 0;
              e.keyCode = 13;
            } else if (c === 13 || c === 27) {
              c = 0;
            } else if (c === 3) {
              c = 99;
            }
            e.charCode = c;
            e.keyChar = e.charCode ? String.fromCharCode(e.charCode) : '';
            break;
        }

        var copiedEvent = {};
        for (var prop in e) {
          copiedEvent[prop] = e[prop];
        }

        for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
          for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
            if (typeListener === typeListenerCache) { typeListener.call(target, copiedEvent); break; }
          }
        }
      });

      typeListeners.push(listener);
    });

    addMethod('removeEventListener', function (type, listener) {
      var target = this;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
        if (typeListener === listener) { typeListeners.splice(i, 1); break; }
      }

      !typeListeners.length &&
        typeListeners.event &&
        target.detachEvent('on' + type, typeListeners.event);
    });

    addMethod('dispatchEvent', function (e) {
      var target = this;
      var type = e.type;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      try {
        return target.fireEvent('on' + type, e);
      } catch (err) {
        return typeListeners.event && typeListeners.event(e);
      }
    });

    function ready() {
      if (ready.interval && document.body) {
        ready.interval = clearInterval(ready.interval);

        document.dispatchEvent(new CustomEvent('DOMContentLoaded'));
      }
    }

    ready.interval = setInterval(ready, 1);

    root.addEventListener('load', ready);
  }());

  (!root.CustomEvent || typeof root.CustomEvent === 'object') && (function() {
    function CustomEvent (type, params) {
      var event;
      params = params || { bubbles: false, cancelable: false, detail: undefined };

      try {
        if (document.createEvent) {
          event = document.createEvent('CustomEvent');
          event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
        } else if (document.createEventObject) {
          event = document.createEventObject();
        }
      } catch (error) {
        event = document.createEvent('Event');
        event.initEvent(type, params.bubbles, params.cancelable);
        event.detail = params.detail;
      }

      return event;
    }

    root.CustomEvent && (CustomEvent.prototype = root.CustomEvent.prototype);
    root.CustomEvent = CustomEvent;
  }());
