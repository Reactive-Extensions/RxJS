(function (root) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function extend(a, b) {
    for(var prop in b) {
      if(hasOwnProperty.call(b, prop)) {
        a[prop] = b[prop];
      }
    }
    return a;
  }

  var SpeechRecognition = root.SpeechRecognition ||
                          root.webkitSpeechRecognition ||
                          root.mozSpeechRecognition ||
                          root.msSpeechRecognition ||
                          root.oSpeechRecognition;

  function fromSpeechRecognition(options) {
    if(!SpeechRecognition) {
      throw new Error('speech recognition not supported');
    }

    options || (options = {});
    var config = extend({
      continuous: false,
      maxAlternatives: 5,
      lang: 'en-US'
    }, options);

    return Rx.Observable.create(function (observer) {
      var recognition = new SpeechRecognition();
      recognition.continuous = config.continuous;

      recognition.onresult = observer.onNext.bind(observer);
      recognition.onerror = observer.onError.bind(observer);
      recognition.onend = observer.onCompleted.bind(observer);

      recognition.start();

      return recognition.stop.bind(recognition);
    });
  }

  function fromSpeechUtterance(text) {
    if (!SpeechSynthesisUtterance) {
      throw new Error('SpeechSynthesisUtterance is not supported');
    }

    return Observable.create(function (observer) {
      var msg = new SpeechSynthesisUtterance(text);

      speechSynthesis.speak(msg);

      msg.onend = function (e) {
        obs.onNext(msg);
        obs.onCompleted();
      };
    });
  }

  function main() {
    var results = document.querySelector('#results');

    var voice = fromSpeechRecognition({ continuous: true })
      .map(function (e) { return e.results[e.resultIndex][0].transcript; })
      .flatMap(fromSpeechUtterance)
      .subscribe(
        function (uttered) {
          var li = document.createElement('li');
          li.innerText = uttered.text;
          results.appendChild(li);
        },
        function (error) {
          var li = document.createElement('li');
          li.innerText = error.error;
          results.appendChild(li);
        });
  }

  main();

}(window));
