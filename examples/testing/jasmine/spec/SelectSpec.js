describe("Map", function() {

    // Aliases
    var TestScheduler = Rx.TestScheduler,
        onNext = Rx.ReactiveTest.onNext,
        onError = Rx.ReactiveTest.onError,
        onCompleted = Rx.ReactiveTest.onCompleted,
        subscribe = Rx.ReactiveTest.subscribe;

    var scheduler,
        xs,
        results;

    beforeEach(function() {
        scheduler = new TestScheduler();
    });

    it("should be able to complete", function() {
        var invoked = 0;
        xs = scheduler.createHotObservable(
            onNext(180, 1),
            onNext(210, 2),
            onNext(240, 3),
            onNext(290, 4),
            onNext(350, 5),
            onCompleted(400),
            onNext(410, -1),
            onCompleted(420),
            onError(430, 'ex')
        );

        results = scheduler.startScheduler(function () {
            return xs.map(function (x) {
                invoked++;
                return x + 1;
            });
        });

        expect(results.messages).toHaveEqualElements(
            onNext(210, 3),
            onNext(240, 4),
            onNext(290, 5),
            onNext(350, 6),
            onCompleted(400)
        );

        expect(xs.subscriptions).toHaveEqualElements(subscribe(200, 400));

        expect(invoked).toEqual(4);
    });
});
