(function () {

  Rx.Examples = {};

  Rx.Examples.fromEvent = function (element, event) {
      return Rx.Observable.createWithDisposable(function (o) {
          var listener = function (e) { o.onNext(e); };
          element.addEventListener(event, listener);
          return Rx.Disposable.create(function () {
              element.removeEventListener(event, listener);
          });
      });
  };


  Rx.Examples.jsonpRequestCold = (function () {
      var uniqueId = 0;
      return function (settings) {
          return Rx.Observable.createWithDisposable(function (observer) {

              if (typeof settings === 'string') {
                  settings = { url: settings }
              }
              if (!settings.jsonp) {
                  settings.jsonp = 'JSONPCallback';
              }

              var head = document.getElementsByTagName('head')[0] || document.documentElement,
                  tag = document.createElement('script'),
                  handler = 'rxjscallback' + uniqueId++;

              settings.url = settings.url.replace('=' + settings.jsonp, '=' + handler);

              window[handler] = function (data) {
                  observer.onNext(data);
                  observer.onCompleted();  
              };

              tag.src = settings.url;
              tag.async = true;
              tag.onload = tag.onreadystatechange = function (_, abort) {
                  if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
                      tag.onload = tag.onreadystatechange = null;
                      if (head && tag.parentNode) {
                          tag.parentElement.remove(tag);
                      }
                      tag = undefined;
                      window[handler] = undefined;
                  }
                  
              };  
              head.insertBefore(tag, head.firstChild);

              return Rx.Disposable.create(function () {
                  if (!tag) {
                      return;
                  }
                  tag.onload = tag.onreadystatechange = null;
                  if (head && tag.parentNode) {
                      tag.parentElement.remove(tag);
                  }
                  tag = undefined;
                  window[handler] = undefined;
              });
          });
      };      

  })();

})();