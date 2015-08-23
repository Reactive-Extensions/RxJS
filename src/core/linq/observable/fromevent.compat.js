  function isNodeList(el) {
    if (window.StaticNodeList) {
      // IE8 Specific
      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
      return (el instanceof window.StaticNodeList || el instanceof window.NodeList);
    } else {
      return (Object.prototype.toString.call(el) == '[object NodeList]')
    }
  }

  function fixEvent(event) {
    var stopPropagation = function () {
      this.cancelBubble = true;
    };

    var preventDefault = function () {
      this.bubbledKeyCode = this.keyCode;
      if (this.ctrlKey) {
        try {
          this.keyCode = 0;
        } catch (e) { }
      }
      this.defaultPrevented = true;
      this.returnValue = false;
      this.modified = true;
    };

    event || (event = root.event);
    if (!event.target) {
      event.target = event.target || event.srcElement;

      if (event.type == 'mouseover') {
        event.relatedTarget = event.fromElement;
      }
      if (event.type == 'mouseout') {
        event.relatedTarget = event.toElement;
      }
      // Adding stopPropogation and preventDefault to IE
      if (!event.stopPropagation) {
        event.stopPropagation = stopPropagation;
        event.preventDefault = preventDefault;
      }
      // Normalize key events
      switch (event.type) {
        case 'keypress':
          var c = ('charCode' in event ? event.charCode : event.keyCode);
          if (c == 10) {
            c = 0;
            event.keyCode = 13;
          } else if (c == 13 || c == 27) {
            c = 0;
          } else if (c == 3) {
            c = 99;
          }
          event.charCode = c;
          event.keyChar = event.charCode ? String.fromCharCode(event.charCode) : '';
          break;
      }
    }

    return event;
  }

  function ListenDisposable(e, n, fn) {
    this._e = e;
    this._n = n;
    this._fn = fn;
    this._e.addEventListener(this._n, this._fn, false);
    this.isDisposed = false;
  }
  ListenDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this._e.removeEventListener(this._n, this._fn, false);
      this.isDisposed = true;
    }
  };

  function AttachEventDisposable(e, n, fn) {
    this._e = e;
    this._n = 'on' + n;
    this._fn = function (e) { fn(fixEvent(e)); };
    this._e.attachEvent(this._n, this._fn);
    this.isDisposed = false;
  }
  AttachEventDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this._e.detachEvent(this._n, this._fn);
      this.isDisposed = true;
    }
  };
  function LevelOneDisposable(e, n, fn) {
    this._e = e;
    this._n = 'on' + n;
    this._e[this._n] = fn;
    this.isDisposed = false;
  }
  LevelOneDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this._e[this._n] = null;
      this.isDisposed = true;
    }
  };

  function createListener (el, eventName, handler) {
    if (el.addEventListener) {
      return new ListenDisposable(el, eventName, handler)
    }
    if (el.attachEvent) {
      return new AttachEventDisposable(el, eventName, handler);
    }
    return LevelOneDisposable(el, eventName, handler);
  }

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList
    if (isNodeList(el) || Object.prototype.toString.call(el) === '[object HTMLCollection]') {
      for (var i = 0, len = el.length; i < len; i++) {
        disposables.add(createEventListener(el.item(i), eventName, handler));
      }
    } else if (el) {
      disposables.add(createListener(el, eventName, handler));
    }

    return disposables;
  }

  /**
   * Configuration option to determine whether to use native events only
   */
  Rx.config.useNativeEvents = false;

  /**
   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
   * @param {Object} element The DOMElement or NodeList to attach a listener.
   * @param {String} eventName The event name to attach the observable sequence.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
   */
  Observable.fromEvent = function (element, eventName, selector) {
    // Node.js specific
    if (element.addListener) {
      return fromEventPattern(
        function (h) { element.addListener(eventName, h); },
        function (h) { element.removeListener(eventName, h); },
        selector);
    }

    // Use only if non-native events are allowed
    if (!Rx.config.useNativeEvents) {
      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
      if (typeof element.on === 'function' && typeof element.off === 'function') {
        return fromEventPattern(
          function (h) { element.on(eventName, h); },
          function (h) { element.off(eventName, h); },
          selector);
      }
    }
    return new AnonymousObservable(function (o) {
      return createEventListener(
        element,
        eventName,
        function handler () {
          var results = arguments[0];
          if (isFunction(selector)) {
            results = tryCatch(selector).apply(null, arguments);
            if (results === errorObj) { return o.onError(results.e); }
          }
          o.onNext(results);
        });
    }).publish().refCount();
  };
