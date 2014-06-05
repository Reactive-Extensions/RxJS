  function createListener (element, name, handler) {
    // Node.js specific
    if (element.addListener) {
      element.addListener(name, handler);
      return disposableCreate(function () {
        element.removeListener(name, handler);
      });
    } 
    if (element.addEventListener) {
      element.addEventListener(name, handler, false);
      return disposableCreate(function () {
        element.removeEventListener(name, handler, false);
      });
    }
    throw new Error('No listener found');
  }

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList
    if (typeof el.item === 'function' && typeof el.length === 'number') {
      for (var i = 0, len = el.length; i < len; i++) {
        disposables.add(createEventListener(el.item(i), eventName, handler));
      }
    } else if (el) {
      disposables.add(createListener(el, eventName, handler));
    }

    return disposables;
  }

  // Check for Angular/jQuery/Zepto support
  var jq =
   !!root.angular && !!angular.element ? angular.element :
   (!!root.jQuery ? root.jQuery : (
     !!root.Zepto ? root.Zepto : null));

  // Check for ember
  var ember = !!root.Ember && typeof root.Ember.addListener === 'function';

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
