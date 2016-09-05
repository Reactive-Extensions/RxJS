requirejs.config({
    paths: {
        'rx.all': '../../dist/rx.all',
        'jquery': 'https://code.jquery.com/jquery-3.1.0.min'
    }
});

// Load the main app module to start the app
requirejs(['jquery', 'keyboard-shortcuts'], function($, kbShortcuts) {

	var shortuctSequences = Rx.Observable
		.fromEvent(document.querySelector("button"), 'click')
		.map( click => document.querySelector("input").value )
	    .startWith('Ctrl+Alt+D', 'Ctrl+Shift+S', 'Trash')
	    .map( text => {
	      return {
	        id: text.replace(/\+/g,'_'),
	        text: text
	      }
	    });

  var validShortcuts = shortuctSequences.filter( seq => kbShortcuts.validate(seq.text) );

  var invalidShortcuts = shortuctSequences.filter( seq => !kbShortcuts.validate(seq.text) );

  var shortCutPrompts = validShortcuts
    .flatMap( obj => {
      return kbShortcuts.create(obj.text)
        .scan((acc, x, seed) => acc + 1, 0)
        .map( count => {
          return {
            id: obj.id,
            count: count
          }
        })
      }
    );


  // Subscriptions for Side Effects
 
  validShortcuts.subscribe(
    seq => {
      var tmpl = '<li id="' + seq.id + '"><span>' + seq.text + ': </span><span>0</span></li>';
      var li = $(tmpl);
      $('ul').append(li);
    }
  );

  invalidShortcuts.subscribe( seq => {
      var tmpl = '<li style="color: red">Invalid sequence ' + seq.text + '</li>';
      var li = $(tmpl);
      $('ul').append(li);
    }
  );

  shortCutPrompts.subscribe(
    obj => $('ul > li#' + obj.id + ' > span').eq(1).text(obj.count)
  );

});
