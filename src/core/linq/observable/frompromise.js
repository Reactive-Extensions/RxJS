    Observable.fromPromise = function (promise) {
        return observableDefer(function () {
            var subject = new AsyncSubject();
            
            promise.then(
                function (value) {
                    subject.onNext(value);
                    subject.onCompleted();
                }, 
                function (reason) {
                   subject.onError(reason);
                });
                
            return subject;
        });
    };