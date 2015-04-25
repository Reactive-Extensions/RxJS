	var FromPromiseObservable = (function(__super__) {
		inherits(FromPromiseObservable, __super__);
		function FromPromiseObservable(promise) {
			this.p = promise;
			__super__.call(this);
		}
		
		FromPromiseObservable.prototype.subscribeCore = function(observer) {
			this.p.then(function (data) {
				observer.onNext(data);
				observer.onCompleted();
			}, function (err) { observer.onError(err); });
			return disposableEmpty;	
		};
		
		return FromPromiseObservable;
	}(ObservableBase));	 
	 
	 /**
	 * Converts a Promise to an Observable sequence
	 * @param {Promise} An ES6 Compliant promise.
	 * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	 */
	var observableFromPromise = Observable.fromPromise = function (promise) {
		return new FromPromiseObservable(promise);
	};