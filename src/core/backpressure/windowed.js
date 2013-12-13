	/** 
	 * Creates a sliding windowed observable based upon the window size.
	 * @param {Number} windowSize The number of items in the window
	 * @returns {Observable} A windowed observable based upon the window size.
	 */
	observableProto.windowed = function (windowSize) {
		return new WindowedObservable(this, windowSize);
	};