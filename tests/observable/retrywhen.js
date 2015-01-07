QUnit.module('RetryWhen');


asyncTest('RetryWhen_Observable_Basic', function () {
    // a notifier to notify of the retry.
    var notifier = new Rx.Subject();

    // a basic source that will crap out after 6 items.
    var source = Rx.Observable.range(0, 10).map(function(n) {
        if(n > 5) {
            throw 'nope';
        }
        return n;
    });

    var once = false;
    var results = [];

    source.doOnError(function(err){
        // trigger the notifier to next the first time
        // or complete after that.

        // this is done async to ensure it happens after
        // the retryWhen handler subscribes internally
        setTimeout(function(){
            if(!once) {
                notifier.onNext(); // retry once
                once = true;
            } else {
                notifier.onCompleted(); // not twice
            }
        }, 0);
    })
    .retryWhen(notifier)
    .subscribe(function(n) {
        results.push(n); // record what has been emitted
    }, function(err) {
        isEqual(false, true, 'this should not happen');
        start();
    }, function() {
        deepEqual(results, [0,1,2,3,4,5,0,1,2,3,4,5]);
        start();
    });
});

