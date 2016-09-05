define(['rx.all', 'keyCodeMap'], function (Rx, keyCodeMap) {

	var keyDowns = Rx.Observable.fromEvent(document, 'keydown');

	var keyUps = Rx.Observable.fromEvent(document, 'keyup');

	var keyEvents = Rx.Observable
		.merge(keyDowns, keyUps)
		.distinctUntilChanged(
			null,
			(a,b) => {
				return a.keyCode === b.keyCode && a.type === b.type;
			}
		)
		.share();

	var createKeyPressStream = (charCode) => {
		return {
		    char: charCode,
		    stream: keyEvents
				.filter((event) => 	event.keyCode === charCode)
				.map(function(e) {
					return e.type;
				})
		};
	}

	var createShortcutStream = (text) => {

	return Rx.Observable
		.from(text.split('+'))
		.map( c => {
			var code = keyCodeMap[c.toLowerCase()];
			if(code === undefined) {
				throw new Error('Invalid sequence ' + text);
			}
			return code;
		})
		.map(createKeyPressStream)
		.map( obj => obj.stream)
		.toArray()
		.flatMap( arr => {
			return Rx.Observable.combineLatest(arr);
		})
		.filter( arr => {
			var isDown = true;
			for (var i = 0; i < arr.length; i++) {
				isDown = isDown && (arr[i] === 'keydown');
			}
			return isDown;
		})
		.map( x => text);

	}

	var validateSeq = text => {
		var arr = text.split('+');
		for (var i = 0; i < arr.length; i++) {
			if(keyCodeMap[arr[i].toLowerCase()] === undefined) {
				return false;
			}
		}
		return true;
	}

  return  {
		create: createShortcutStream,
		validate: validateSeq
	};

});
