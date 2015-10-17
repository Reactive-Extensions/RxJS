(function (global, $, Rx) {

  // Search Wikipedia for a given term
  function searchWikipedia (term) {
    return $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'opensearch',
        format: 'json',
        search: term
      }
    }).promise();
  }

  function main() {
    var $input = $('#textInput'),
        $results = $('#results');

    // Get all distinct key up events from the input and only fire if long enough and distinct
    var keyup = Rx.Observable.fromEvent($input, 'keyup')
      .map(function (e) {
        return e.target.value; // Project the text from the input
      })
      .filter(function (text) {
        return text.length > 2; // Only if the text is longer than 2 characters
      })
      .debounce(750 /* Pause for 750ms */ )
      .distinctUntilChanged(); // Only if the value has changed

    var searcher = keyup.flatMapLatest(searchWikipedia);

    searcher.subscribe(
      function (data) {
        $results
          .empty()
          .append ($.map(data[1], function (v) { return $('<li>').text(v); }));
      },
      function (error) {
        $results
          .empty()
          .append($('<li>'))
          .text('Error:' + error);
      });
  }

  $(main);

}(window, jQuery, Rx));
