(function (global, undefined) {

    // Search Wikipedia for a given term
    function searchWikipedia(term) {
        var cleanTerm = global.encodeURIComponent(term);
        var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
            + cleanTerm + '&callback=JSONPCallback';
        return Rx.Examples.jsonpRequestCold(url);
    }

    function clearChildren (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }                
    }

    function main() {
        var input = document.querySelector('#searchtext'),
            results = document.querySelector('#results');

        // Get all distinct key up events from the input and only fire if long enough and distinct
        var keyup = Rx.Examples.fromEvent(input, 'keyup').select(function (e) {
            return e.target.value; // Project the text from the input
        })
        .where(function (text) {
            return text.length > 2; // Only if the text is longer than 2 characters
        })
        .throttle(
            750 // Pause for 750ms
        )
        .distinctUntilChanged(); // Only if the value has changed

        var searcher = keyup.select(function (text) { 
            return searchWikipedia(text); // Search wikipedia
        })
        .switchLatest() // Ensure no out of order results
        .where(function (data) {
            return data.length === 2; // Where we have data
        });

        searcher.subscribe(function (data) {

            // Append the results
            clearChildren(results);

            var res = data[1];

            var i, len, li;
            for(i = 0, len = res.length; i < len; i++) {
                var li = document.createElement('li');
                li.innerHTML = res[i];
                results.appendChild(li); 
            }
        }, function (error) {

            // Handle any errors
            clearChildren(results);

            var li = document.createElement('li');
            li.innerHTML = 'Error: ' + error;
            results.appendChild(li);
        });
    }

    main();

}(window));