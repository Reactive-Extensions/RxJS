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

  function createListener (element, name, handler) {
    // Standards compliant
    if (element.addEventListener) {
      element.addEventListener(name, handler, false);
      return disposableCreate(function () {
        element.removeEventListener(name, handler, false);
      });
    }
    if (element.attachEvent) {
      // IE Specific
      var innerHandler = function (event) {
        handler(fixEvent(event));
      };
      element.attachEvent('on' + name, innerHandler);
      return disposableCreate(function () {
        element.detachEvent('on' + name, innerHandler);
      });
    }
    // Level 1 DOM Events
    element['on' + name] = handler;
    return disposableCreate(function () {
      element['on' + name] = null;
    });
  }

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList
    if (Object.prototype.toString.call(el) === '[object NodeList]') {
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

  // Check for Angular/jQuery/Zepto support
  var jq =
   !!root.angular && !!angular.element ? angular.element :
   (!!root.jQuery ? root.jQuery : (
     !!root.Zepto ? root.Zepto : null));

  // Check for ember
  var ember = !!root.Ember && typeof root.Ember.addListener === 'function';

  // Check for Backbone.Marionette. Note if using AMD add Marionette as a dependency of rxjs
  // for proper loading order!
  var marionette = !!root.Backbone && !!root.Backbone.Marionette;

  /**
   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
   *
   * @example
   *   var source = Rx.Observable.fromEvent(element, 'mouseup');
   *
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
      if (marionette) {
        return fromEventPattern(
          function (h) { element.on(eventName, h); },
          function (h) { element.off(eventName, h); },
          selector);
      }
      if (ember) {
        return fromEventPattern(
          function (h) { Ember.addListener(element, eventName, h); },
          function (h) { Ember.removeListener(element, eventName, h); },
          selector);
      }
      if (jq) {
        var $elem = jq(element);
        return fromEventPattern(
          function (h) { $elem.on(eventName, h); },
          function (h) { $elem.off(eventName, h); },
          selector);
      }
    }
    return new AnonymousObservable(function (observer) {
      return createEventListener(
        element,
        eventName,
        function handler (e) {
          var results = e;

          if (selector) {
            try {
              results = selector(arguments);
            } catch (err) {
              observer.onError(err);
              return
            }
          }

          observer.onNext(results);
        });
    }).publish().refCount();
  };
