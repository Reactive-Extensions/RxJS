(function (global, undefined) {

    // Search Wikipedia for a given term
    function searchWikipedia (term) {
        var promise = $.ajax({
            url: 'http://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                format: 'json',
                search: encodeURI(term)
            }
        }).promise();
        return Rx.Observable.fromPromise(promise);
    }

    function main() {
        var input = $('#textInput'),
            results = $('#results');

        // Get all distinct key up events from the input and only fire if long enough and distinct
        var keyup = Rx.DOM.fromEvent(input, 'keyup')
            .map(function (e) {
                return e.target.value; // Project the text from the input
            })
            .filter(function (text) {
                return text.length > 2; // Only if the text is longer than 2 characters
            })
            .throttle(750 /* Pause for 750ms */ )
            .distinctUntilChanged(); // Only if the value has changed

        var searcher = keyup.flatMapLatest(
            function (text) { 
                return searchWikipedia(text); // Search wikipedia
            });

        var subscription = searcher.subscribe(
            function (data) {
                // Append the results
                clearChildren(results);

                var res = data[1];

                var i, len, li;
                for(i = 0, len = res.length; i < len; i++) {
                    li = document.createElement('li');
                    li.innerHTML = res[i];
                    results.appendChild(li); 
                }
            }, 
            function (error) {
                // Handle any errors
                clearChildren(results);

                var li = document.createElement('li');
                li.innerHTML = 'Error: ' + error;
                results.appendChild(li);
            });
    }

    main();

}(window));