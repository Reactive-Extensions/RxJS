(function (global, $, undefined) {

  // Search Wikipedia for a given term
  function searchWikipedia (term) {
    return $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'opensearch',
        format: 'json',
        search: global.encodeURI(term)
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
      .throttle(750 /* Pause for 750ms */ )
      .distinctUntilChanged(); // Only if the value has changed

    var searcher = keyup.flatMapLatest(searchWikipedia);

    var subscription = searcher.subscribe(
      function (data) {
        var res = data[1];

        // Append the results
        $results.empty();

        $.each(res, function (_, value) {
          $('<li>' + value + '</li>').appendTo(results);
        });
      }, 
      function (error) {
        // Handle any errors
        $results.empty();

        $('<li>Error: ' + error + '</li>').appendTo(results);
      });
  }

  main();

}(window, jQuery));