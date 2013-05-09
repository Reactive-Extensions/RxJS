/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ObservableMultipleTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;


    test('TakeUntil_Preempt_SomeData_Next', function () {
        var l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onNext(225, 99), onCompleted(230)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(225));
    });

    test('TakeUntil_Preempt_SomeData_Error', function () {
        var ex, l, lMsgs, r, rMsgs, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onError(225, ex)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onError(225, ex));
    });

    test('TakeUntil_NoPreempt_SomeData_Empty', function () {
        var l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onCompleted(225)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    });

    test('TakeUntil_NoPreempt_SomeData_Never', function () {
        var l, lMsgs, r, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        l = scheduler.createHotObservable(lMsgs);
        r = Observable.never();
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    });

    test('TakeUntil_Preempt_Never_Next', function () {
        var l, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onNext(225, 2), onCompleted(250)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onCompleted(225));
    });

    test('TakeUntil_Preempt_Never_Error', function () {
        var ex, l, r, rMsgs, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onError(225, ex)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onError(225, ex));
    });

    test('TakeUntil_NoPreempt_Never_Empty', function () {
        var l, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onCompleted(225)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual();
    });

    test('TakeUntil_NoPreempt_Never_Never', function () {
        var l, r, results, scheduler;
        scheduler = new TestScheduler();
        l = Observable.never();
        r = Observable.never();
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual();
    });

    test('TakeUntil_Preempt_BeforeFirstProduced', function () {
        var l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(230, 2), onCompleted(240)];
        rMsgs = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onCompleted(210));
    });

    test('TakeUntil_Preempt_BeforeFirstProduced_RemainSilentAndProperDisposed', function () {
        var l, lMsgs, r, rMsgs, results, scheduler, sourceNotDisposed;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onError(215, 'ex'), onCompleted(240)];
        rMsgs = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
        sourceNotDisposed = false;
        l = scheduler.createHotObservable(lMsgs).doAction(function () {
            sourceNotDisposed = true;
        });
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onCompleted(210));
        ok(!sourceNotDisposed);
    });

    test('TakeUntil_NoPreempt_AfterLastProduced_ProperDisposedSignal', function () {
        var l, lMsgs, r, rMsgs, results, scheduler, signalNotDisposed;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(230, 2), onCompleted(240)];
        rMsgs = [onNext(150, 1), onNext(250, 2), onCompleted(260)];
        signalNotDisposed = false;
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs).doAction(function () {
            signalNotDisposed = true;
        });
        results = scheduler.startWithCreate(function () {
            return l.takeUntil(r);
        });
        results.messages.assertEqual(onNext(230, 2), onCompleted(240));
        ok(!signalNotDisposed);
    });

    test('SkipUntil_SomeData_Next', function () {
        var l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onNext(225, 99), onCompleted(230)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual(onNext(230, 4), onNext(240, 5), onCompleted(250));
    });

    test('SkipUntil_SomeData_Error', function () {
        var ex, l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onError(225, ex)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual(onError(225, ex));
    });

    test('SkipUntil_SomeData_Empty', function () {
        var l, lMsgs, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        rMsgs = [onNext(150, 1), onCompleted(225)];
        l = scheduler.createHotObservable(lMsgs);
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
    });

    test('SkipUntil_Never_Next', function () {
        var l, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onNext(225, 2), onCompleted(250)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
    });

    test('SkipUntil_Never_Error', function () {
        var ex, l, r, rMsgs, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onError(225, ex)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual(onError(225, ex));
    });

    test('SkipUntil_SomeData_Never', function () {
        var l, lMsgs, r, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        l = scheduler.createHotObservable(lMsgs);
        r = Observable.never();
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
    });

    test('SkipUntil_Never_Empty', function () {
        var l, r, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onCompleted(225)];
        l = Observable.never();
        r = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
    });

    test('SkipUntil_Never_Never', function () {
        var l, r, results, scheduler;
        scheduler = new TestScheduler();
        l = Observable.never();
        r = Observable.never();
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
    });

    test('SkipUntil_HasCompletedCausesDisposal', function () {
        var disposed, l, lMsgs, r, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        disposed = false;
        l = scheduler.createHotObservable(lMsgs);
        r = Observable.create(function () {
            return function () {
                disposed = true;
            };
        });
        results = scheduler.startWithCreate(function () {
            return l.skipUntil(r);
        });
        results.messages.assertEqual();
        ok(disposed);
    });

    test('Merge_Never2', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = Observable.never();
        n2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, n1, n2);
        });
        results.messages.assertEqual();
    });

    test('Merge_Never3', function () {
        var n1, n2, n3, results, scheduler;
        scheduler = new TestScheduler();
        n1 = Observable.never();
        n2 = Observable.never();
        n3 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, n1, n2, n3);
        });
        results.messages.assertEqual();
    });

    test('Merge_Empty2', function () {
        var e1, e2, results, scheduler;
        scheduler = new TestScheduler();
        e1 = Observable.empty();
        e2 = Observable.empty();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, e2);
        });
        results.messages.assertEqual(onCompleted(203));
    });

    test('Merge_Empty3', function () {
        var e1, e2, e3, results, scheduler;
        scheduler = new TestScheduler();
        e1 = Observable.empty();
        e2 = Observable.empty();
        e3 = Observable.empty();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, e2, e3);
        });
        results.messages.assertEqual(onCompleted(204));
    });

    test('Merge_EmptyDelayed2_RightLast', function () {
        var e1, e2, lMsgs, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onCompleted(240)];
        rMsgs = [onNext(150, 1), onCompleted(250)];
        e1 = scheduler.createHotObservable(lMsgs);
        e2 = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, e2);
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('Merge_EmptyDelayed2_LeftLast', function () {
        var e1, e2, lMsgs, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        lMsgs = [onNext(150, 1), onCompleted(250)];
        rMsgs = [onNext(150, 1), onCompleted(240)];
        e1 = scheduler.createHotObservable(lMsgs);
        e2 = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, e2);
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('Merge_EmptyDelayed3_MiddleLast', function () {
        var e1, e2, e3, msgs1, msgs2, msgs3, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(245)];
        msgs2 = [onNext(150, 1), onCompleted(250)];
        msgs3 = [onNext(150, 1), onCompleted(240)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        e3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, e2, e3);
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('Merge_EmptyNever', function () {
        var e1, msgs1, n1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(245)];
        e1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, n1);
        });
        results.messages.assertEqual();
    });

    test('Merge_NeverEmpty', function () {
        var e1, msgs1, n1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(245)];
        e1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, n1, e1);
        });
        results.messages.assertEqual();
    });

    test('Merge_ReturnNever', function () {
        var msgs1, n1, r1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(245)];
        r1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, r1, n1);
        });
        results.messages.assertEqual(onNext(210, 2));
    });

    test('Merge_NeverReturn', function () {
        var msgs1, n1, r1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(245)];
        r1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, n1, r1);
        });
        results.messages.assertEqual(onNext(210, 2));
    });

    test('Merge_ErrorNever', function () {
        var e1, ex, msgs1, n1, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, n1);
        });
        results.messages.assertEqual(onNext(210, 2), onError(245, ex));
    });

    test('Merge_NeverError', function () {
        var e1, ex, msgs1, n1, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        n1 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, n1, e1);
        });
        results.messages.assertEqual(onNext(210, 2), onError(245, ex));
    });

    test('Merge_EmptyReturn', function () {
        var e1, msgs1, msgs2, r1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(245)];
        msgs2 = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        r1 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, e1, r1);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(250));
    });

    test('Merge_ReturnEmpty', function () {
        var e1, msgs1, msgs2, r1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(245)];
        msgs2 = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        r1 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, r1, e1);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(250));
    });

    test('Merge_Lots2', function () {
        var i, msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 6), onNext(240, 8), onCompleted(245)];
        msgs2 = [onNext(150, 1), onNext(215, 3), onNext(225, 5), onNext(235, 7), onNext(245, 9), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, o1, o2);
        }).messages;
        equal(9, results.length);
        for (i = 0; i < 8; i++) {
            ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
        }
        ok(results[8].value.kind === 'C' && results[8].time === 250);
    });
    test('Merge_Lots3', function () {
        var i, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(225, 5), onNext(240, 8), onCompleted(245)];
        msgs2 = [onNext(150, 1), onNext(215, 3), onNext(230, 6), onNext(245, 9), onCompleted(250)];
        msgs3 = [onNext(150, 1), onNext(220, 4), onNext(235, 7), onCompleted(240)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, o1, o2, o3);
        }).messages;
        equal(9, results.length);
        for (i = 0; i < 8; i++) {
            ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
        }
        ok(results[8].value.kind === 'C' && results[8].time === 250);
    });
    test('Merge_ErrorLeft', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
        msgs2 = [onNext(150, 1), onNext(215, 3), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, o1, o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(215, 3), onError(245, ex));
    });
    test('Merge_ErrorCausesDisposal', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(210, ex)];
        msgs2 = [onNext(150, 1), onNext(220, 1), onCompleted(250)];
        sourceNotDisposed = false;
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2).doAction(function () {
            return sourceNotDisposed = true;
        });
        results = scheduler.startWithCreate(function () {
            return Observable.merge(scheduler, o1, o2);
        });
        results.messages.assertEqual(onError(210, ex));
        ok(!sourceNotDisposed);
    });
    test('Merge_ObservableOfObservable_Data', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onNext(120, 305), onCompleted(150))), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.mergeObservable();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 103), onNext(410, 201), onNext(420, 104), onNext(420, 202), onNext(430, 203), onNext(440, 204), onNext(510, 105), onNext(510, 301), onNext(520, 106), onNext(520, 302), onNext(530, 303), onNext(540, 304), onNext(620, 305), onCompleted(650));
    });
    test('Merge_ObservableOfObservable_Data_NonOverlapped', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(50))), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.mergeObservable();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onNext(510, 301), onNext(520, 302), onNext(530, 303), onNext(540, 304), onCompleted(600));
    });
    test('Merge_ObservableOfObservable_InnerThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onError(50, ex))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(50))), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.mergeObservable();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(450, ex));
    });
    test('Merge_ObservableOfObservable_OuterThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onError(500, ex));
        results = scheduler.startWithCreate(function () {
            return xs.mergeObservable();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(500, ex));
    });
    test('Switch_Data', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(150))), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.switchLatest();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onNext(510, 301), onNext(520, 302), onNext(530, 303), onNext(540, 304), onCompleted(650));
    });
    test('Switch_InnerThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onError(50, ex))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(150))), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.switchLatest();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(450, ex));
    });
    test('Switch_OuterThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onError(500, ex));
        results = scheduler.startWithCreate(function () {
            return xs.switchLatest();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(500, ex));
    });
    test('Switch_NoInner', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(500));
        results = scheduler.startWithCreate(function () {
            return xs.switchLatest();
        });
        results.messages.assertEqual(onCompleted(500));
    });
    test('Switch_InnerCompletes', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onCompleted(540));
        results = scheduler.startWithCreate(function () {
            return xs.switchLatest();
        });
        results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 103), onNext(420, 104), onNext(510, 105), onNext(520, 106), onCompleted(540));
    });
    test('Amb_Never2', function () {
        var l, r, results, scheduler;
        scheduler = new TestScheduler();
        l = Observable.never();
        r = Observable.never();
        results = scheduler.startWithCreate(function () {
            return l.amb(r);
        });
        results.messages.assertEqual();
    });
    test('Amb_Never3', function () {
        var n1, n2, n3, results, scheduler;
        scheduler = new TestScheduler();
        n1 = Observable.never();
        n2 = Observable.never();
        n3 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.amb(n1, n2, n3);
        });
        results.messages.assertEqual();
    });
    test('Amb_NeverEmpty', function () {
        var e, n, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onCompleted(225)];
        n = Observable.never();
        e = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return n.amb(e);
        });
        results.messages.assertEqual(onCompleted(225));
    });
    test('Amb_EmptyNever', function () {
        var e, n, rMsgs, results, scheduler;
        scheduler = new TestScheduler();
        rMsgs = [onNext(150, 1), onCompleted(225)];
        n = Observable.never();
        e = scheduler.createHotObservable(rMsgs);
        results = scheduler.startWithCreate(function () {
            return e.amb(n);
        });
        results.messages.assertEqual(onCompleted(225));
    });
    test('Amb_RegularShouldDisposeLoser', function () {
        var msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(240)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(250)];
        sourceNotDisposed = false;
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2).doAction(function () {
            return sourceNotDisposed = true;
        });
        results = scheduler.startWithCreate(function () {
            return o1.amb(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(240));
        ok(!sourceNotDisposed);
    });
    test('Amb_WinnerThrows', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, ex)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(250)];
        sourceNotDisposed = false;
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2).doAction(function () {
            return sourceNotDisposed = true;
        });
        results = scheduler.startWithCreate(function () {
            return o1.amb(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onError(220, ex));
        ok(!sourceNotDisposed);
    });
    test('Amb_LoserThrows', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(220, 2), onError(230, ex)];
        msgs2 = [onNext(150, 1), onNext(210, 3), onCompleted(250)];
        sourceNotDisposed = false;
        o1 = scheduler.createHotObservable(msgs1).doAction(function () {
            return sourceNotDisposed = true;
        });
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.amb(o2);
        });
        results.messages.assertEqual(onNext(210, 3), onCompleted(250));
        ok(!sourceNotDisposed);
    });
    test('Amb_ThrowsBeforeElection', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(210, ex)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(250)];
        sourceNotDisposed = false;
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2).doAction(function () {
            return sourceNotDisposed = true;
        });
        results = scheduler.startWithCreate(function () {
            return o1.amb(o2);
        });
        results.messages.assertEqual(onError(210, ex));
        ok(!sourceNotDisposed);
    });
    test('Catch_NoErrors', function () {
        var msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(230)];
        msgs2 = [onNext(240, 5), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(230));
    });
    test('Catch_Never', function () {
        var msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs2 = [onNext(240, 5), onCompleted(250)];
        o1 = Observable.never();
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual();
    });
    test('Catch_Empty', function () {
        var msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(240, 5), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onCompleted(230));
    });
    test('Catch_Return', function () {
        var msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        msgs2 = [onNext(240, 5), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(230));
    });
    test('Catch_Error', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
        msgs2 = [onNext(240, 5), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 5), onCompleted(250));
    });
    test('Catch_Error_Never', function () {
        var ex, msgs1, o1, o2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3));
    });
    test('Catch_Error_Error', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, 'ex1')];
        msgs2 = [onNext(240, 4), onError(250, ex)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onError(250, ex));
    });
    test('Catch_Multiple', function () {
        var ex, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
        msgs2 = [onNext(220, 3), onError(225, ex)];
        msgs3 = [onNext(230, 4), onCompleted(235)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return Observable.catchException(o1, o2, o3);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(235));
    });
    test('Catch_ErrorSpecific_Caught', function () {
        var ex, handlerCalled, msgs1, msgs2, o1, o2, results, scheduler;
        ex = 'ex';
        handlerCalled = false;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
        msgs2 = [onNext(240, 4), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(function (e) {
                handlerCalled = true;
                return o2;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
        ok(handlerCalled);
    });
    test('Catch_ErrorSpecific_CaughtImmediate', function () {
        var ex, handlerCalled, msgs2, o2, results, scheduler;
        ex = 'ex';
        handlerCalled = false;
        scheduler = new TestScheduler();
        msgs2 = [onNext(240, 4), onCompleted(250)];
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return Observable.throwException('ex').catchException(function (e) {
                handlerCalled = true;
                return o2;
            });
        });
        results.messages.assertEqual(onNext(240, 4), onCompleted(250));
        ok(handlerCalled);
    });
    test('Catch_HandlerThrows', function () {
        var ex, ex2, handlerCalled, msgs1, o1, results, scheduler;
        ex = 'ex';
        ex2 = 'ex2';
        handlerCalled = false;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
        o1 = scheduler.createHotObservable(msgs1);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(function (e) {
                handlerCalled = true;
                throw ex2;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onError(230, ex2));
        ok(handlerCalled);
    });
    test('Catch_Nested_OuterCatches', function () {
        var ex, firstHandlerCalled, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler, secondHandlerCalled;
        ex = 'ex';
        firstHandlerCalled = false;
        secondHandlerCalled = false;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
        msgs2 = [onNext(220, 3), onCompleted(225)];
        msgs3 = [onNext(220, 4), onCompleted(225)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(function (e) {
                firstHandlerCalled = true;
                return o2;
            }).catchException(function (e) {
                secondHandlerCalled = true;
                return o3;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(225));
        ok(firstHandlerCalled);
        ok(!secondHandlerCalled);
    });
    test('Catch_ThrowFromNestedCatch', function () {
        var ex, ex2, firstHandlerCalled, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler, secondHandlerCalled;
        ex = 'ex';
        ex2 = 'ex';
        firstHandlerCalled = false;
        secondHandlerCalled = false;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
        msgs2 = [onNext(220, 3), onError(225, ex2)];
        msgs3 = [onNext(230, 4), onCompleted(235)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return o1.catchException(function (e) {
                firstHandlerCalled = true;
                equal(e, ex);
                return o2;
            }).catchException(function (e) {
                secondHandlerCalled = true;
                equal(e, ex2);
                return o3;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(235));
        ok(firstHandlerCalled);
        ok(secondHandlerCalled);
    });
    test('OnErrorResumeNext_NoErrors', function () {
        var msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(230)];
        msgs2 = [onNext(240, 4), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.onErrorResumeNext(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
    });
    test('OnErrorResumeNext_Error', function () {
        var msgs1, msgs2, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, 'ex')];
        msgs2 = [onNext(240, 4), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.onErrorResumeNext(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
    });
    test('OnErrorResumeNext_ErrorMultiple', function () {
        var msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, 'ex')];
        msgs2 = [onNext(230, 4), onError(240, 'ex')];
        msgs3 = [onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        results = scheduler.startWithCreate(function () {
            return Observable.onErrorResumeNext(o1, o2, o3);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(230, 4), onCompleted(250));
    });
    test('OnErrorResumeNext_EmptyReturnThrowAndMore', function () {
        var msgs1, msgs2, msgs3, msgs4, msgs5, o1, o2, o3, o4, o5, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(205)];
        msgs2 = [onNext(215, 2), onCompleted(220)];
        msgs3 = [onNext(225, 3), onNext(230, 4), onCompleted(235)];
        msgs4 = [onError(240, 'ex')];
        msgs5 = [onNext(245, 5), onCompleted(250)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        o3 = scheduler.createHotObservable(msgs3);
        o4 = scheduler.createHotObservable(msgs4);
        o5 = scheduler.createHotObservable(msgs5);
        results = scheduler.startWithCreate(function () {
            return Observable.onErrorResumeNext(o1, o2, o3, o4, o5);
        });
        results.messages.assertEqual(onNext(215, 2), onNext(225, 3), onNext(230, 4), onNext(245, 5), onCompleted(250));
    });
    test('OnErrorResumeNext_EmptyReturnThrowAndMore', function () {
        var ex, msgs1, msgs2, o1, o2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
        msgs2 = [onError(230, ex)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return o1.onErrorResumeNext(o2);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(230));
    });
    test('OnErrorResumeNext_SingleSourceThrows', function () {
        var ex, msgs1, o1, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onError(230, ex)];
        o1 = scheduler.createHotObservable(msgs1);
        results = scheduler.startWithCreate(function () {
            return Observable.onErrorResumeNext(o1);
        });
        results.messages.assertEqual(onCompleted(230));
    });
    test('OnErrorResumeNext_EndWithNever', function () {
        var msgs1, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
        o1 = scheduler.createHotObservable(msgs1);
        o2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.onErrorResumeNext(o1, o2);
        });
        results.messages.assertEqual(onNext(210, 2));
    });
    test('OnErrorResumeNext_StartWithNever', function () {
        var msgs1, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
        o1 = Observable.never();
        o2 = scheduler.createHotObservable(msgs1);
        results = scheduler.startWithCreate(function () {
            return Observable.onErrorResumeNext(o1, o2);
        });
        results.messages.assertEqual();
    });
    test('Zip_NeverNever', function () {
        var o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        o1 = Observable.never();
        o2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return o1.zip(o2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('Zip_NeverEmpty', function () {
        var msgs, o1, o2, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(210)];
        o1 = Observable.never();
        o2 = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return o1.zip(o2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('Zip_EmptyEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onCompleted(210)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(210));
    });
    test('Zip_EmptyNonEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(215));
    });
    test('Zip_NonEmptyEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(215));
    });
    test('Zip_NeverNonEmpty', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('Zip_NonEmptyNever', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('Zip_NonEmptyNonEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(240)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(220, 2 + 3), onCompleted(240));
    });
    test('Zip_EmptyError', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_ErrorEmpty', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_NeverError', function () {
        var e1, e2, ex, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_ErrorNever', function () {
        var e1, e2, ex, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_ErrorError', function () {
        var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(230, ex1)];
        msgs2 = [onNext(150, 1), onError(220, ex2)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex2));
    });
    test('Zip_SomeError', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_ErrorSome', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.zip(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Zip_SomeDataAsymmetric1', function () {
        var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
        scheduler = new TestScheduler();
        msgs1 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 5; i++) {
                _results.push(onNext(205 + i * 5, i));
            }
            return _results;
        })();
        msgs2 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 10; i++) {
                _results.push(onNext(205 + i * 8, i));
            }
            return _results;
        })();
        len = Math.min(msgs1.length, msgs2.length);
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        }).messages;
        equal(len, results.length);
        for (i = 0; i < len; i++) {
            sum = msgs1[i].value.value + msgs2[i].value.value;
            time = Math.max(msgs1[i].time, msgs2[i].time);
            ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
        }
    });
    test('Zip_SomeDataAsymmetric2', function () {
        var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
        scheduler = new TestScheduler();
        msgs1 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 10; i++) {
                _results.push(onNext(205 + i * 5, i));
            }
            return _results;
        })();
        msgs2 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 5; i++) {
                _results.push(onNext(205 + i * 8, i));
            }
            return _results;
        })();
        len = Math.min(msgs1.length, msgs2.length);
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        }).messages;
        equal(len, results.length);
        for (i = 0; i < len; i++) {
            sum = msgs1[i].value.value + msgs2[i].value.value;
            time = Math.max(msgs1[i].time, msgs2[i].time);
            ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
        }
    });
    test('Zip_SomeDataSymmetric', function () {
        var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
        scheduler = new TestScheduler();
        msgs1 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 10; i++) {
                _results.push(onNext(205 + i * 5, i));
            }
            return _results;
        })();
        msgs2 = (function () {
            var _results;
            _results = [];
            for (i = 0; i < 10; i++) {
                _results.push(onNext(205 + i * 8, i));
            }
            return _results;
        })();
        len = Math.min(msgs1.length, msgs2.length);
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                return x + y;
            });
        }).messages;
        equal(len, results.length);
        for (i = 0; i < len; i++) {
            sum = msgs1[i].value.value + msgs2[i].value.value;
            time = Math.max(msgs1[i].time, msgs2[i].time);
            ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
        }
    });
    test('Zip_SelectorThrows', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(240)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onNext(230, 5), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.zip(e2, function (x, y) {
                if (y === 5) {
                    throw ex;
                } else {
                    return x + y;
                }
            });
        });
        results.messages.assertEqual(onNext(220, 2 + 3), onError(230, ex));
    });
    test('CombineLatest_NeverNever', function () {
        var e1, e2, results, scheduler;
        scheduler = new TestScheduler();
        e1 = Observable.never();
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('CombineLatest_NeverEmpty', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(210)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('CombineLatest_EmptyNever', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(210)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('CombineLatest_EmptyEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onCompleted(210)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(210));
    });
    test('CombineLatest_EmptyReturn', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(215));
    });
    test('CombineLatest_ReturnEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(210)];
        msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(215));
    });
    test('CombineLatest_NeverReturn', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        e1 = scheduler.createHotObservable(msgs);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('CombineLatest_ReturnNever', function () {
        var e1, e2, msgs, results, scheduler;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(215, 2), onCompleted(210)];
        e1 = scheduler.createHotObservable(msgs);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
    });
    test('CombineLatest_ReturnReturn', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(240)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(220, 2 + 3), onCompleted(240));
    });
    test('CombineLatest_EmptyError', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ErrorEmpty', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ReturnThrow', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ThrowReturn', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ThrowThrow', function () {
        var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(220, ex1)];
        msgs2 = [onNext(150, 1), onError(230, ex2)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex1));
    });
    test('CombineLatest_ErrorThrow', function () {
        var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, ex1)];
        msgs2 = [onNext(150, 1), onError(230, ex2)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex1));
    });
    test('CombineLatest_ThrowError', function () {
        var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, ex1)];
        msgs2 = [onNext(150, 1), onError(230, ex2)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex1));
    });
    test('CombineLatest_NeverThrow', function () {
        var e1, e2, ex, msgs, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(220, ex)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ThrowNever', function () {
        var e1, e2, ex, msgs, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(220, ex)];
        e1 = Observable.never();
        e2 = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_SomeThrow', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ThrowSome', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(220, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('CombineLatest_ThrowAfterCompleteLeft', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        msgs2 = [onNext(150, 1), onError(230, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('CombineLatest_ThrowAfterCompleteRight', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
        msgs2 = [onNext(150, 1), onError(230, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('CombineLatest_InterleavedWithTail', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onNext(230, 5), onNext(235, 6), onNext(240, 7), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(220, 2 + 3), onNext(225, 3 + 4), onNext(230, 4 + 5), onNext(235, 4 + 6), onNext(240, 4 + 7), onCompleted(250));
    });
    test('CombineLatest_Consecutive', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(235, 4 + 6), onNext(240, 4 + 7), onCompleted(250));
    });
    test('CombineLatest_ConsecutiveEndWithErrorLeft', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onError(230, ex)];
        msgs2 = [onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('CombineLatest_ConsecutiveEndWithErrorRight', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(235, 6), onNext(240, 7), onError(245, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e2.combineLatest(e1, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(235, 4 + 6), onNext(240, 4 + 7), onError(245, ex));
    });
    test('CombineLatest_SelectorThrows', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(240)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.combineLatest(e2, function () {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });
    test('Concat_EmptyEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onCompleted(250));
    });
    test('Concat_EmptyNever', function () {
        var e1, e2, msgs1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual();
    });
    test('Concat_NeverEmpty', function () {
        var e1, e2, msgs1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e2.concat(e1);
        });
        results.messages.assertEqual();
    });
    test('Concat_NeverNever', function () {
        var e1, e2, results, scheduler;
        scheduler = new TestScheduler();
        e1 = Observable.never();
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual();
    });
    test('Concat_EmptyThrow', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(250, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onError(250, ex));
    });
    test('Concat_ThrowEmpty', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(230, ex)];
        msgs2 = [onNext(150, 1), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('Concat_ThrowThrow', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(230, ex)];
        msgs2 = [onNext(150, 1), onError(250, 'ex2')];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('Concat_ReturnEmpty', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(210, 2), onCompleted(250));
    });
    test('Concat_EmptyReturn', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(240, 2), onCompleted(250));
    });
    test('Concat_ReturnNever', function () {
        var e1, e2, msgs1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(210, 2));
    });
    test('Concat_NeverReturn', function () {
        var e1, e2, msgs1, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = Observable.never();
        results = scheduler.startWithCreate(function () {
            return e2.concat(e1);
        });
        results.messages.assertEqual();
    });
    test('Concat_ReturnReturn', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onNext(240, 3), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(220, 2), onNext(240, 3), onCompleted(250));
    });
    test('Concat_ThrowReturn', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onError(230, ex)];
        msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onError(230, ex));
    });
    test('Concat_ReturnThrow', function () {
        var e1, e2, ex, msgs1, msgs2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
        msgs2 = [onNext(150, 1), onError(250, ex)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(220, 2), onError(250, ex));
    });
    test('Concat_SomeDataSomeData', function () {
        var e1, e2, msgs1, msgs2, results, scheduler;
        scheduler = new TestScheduler();
        msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(225)];
        msgs2 = [onNext(150, 1), onNext(230, 4), onNext(240, 5), onCompleted(250)];
        e1 = scheduler.createHotObservable(msgs1);
        e2 = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return e1.concat(e2);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    });
    test('MergeConcat_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.merge(2);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onNext(440, 7), onNext(460, 8), onNext(670, 9), onNext(700, 10), onCompleted(760));
        xs.subscriptions.assertEqual(subscribe(200, 760));
    });
    test('MergeConcat_Basic_Long', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.merge(2);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onNext(440, 7), onNext(460, 8), onNext(690, 9), onNext(720, 10), onCompleted(780));
        xs.subscriptions.assertEqual(subscribe(200, 780));
    });
    test('MergeConcat_Basic_Wide', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(450));
        results = scheduler.startWithCreate(function () {
            return xs.merge(3);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(280, 6), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 7), onNext(380, 8), onNext(630, 9), onNext(660, 10), onCompleted(720));
        xs.subscriptions.assertEqual(subscribe(200, 720));
    });
    test('MergeConcat_Basic_Late', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(750));
        results = scheduler.startWithCreate(function () {
            return xs.merge(3);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(280, 6), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 7), onNext(380, 8), onNext(630, 9), onNext(660, 10), onCompleted(750));
        xs.subscriptions.assertEqual(subscribe(200, 750));
    });
    test('MergeConcat_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(400));
        results = scheduler.startWithDispose(function () {
            return xs.merge(2);
        }, 450);
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onNext(440, 7));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });
    test('MergeConcat_OuterError', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onError(400, ex));
        results = scheduler.startWithCreate(function () {
            return xs.merge(2);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onError(400, ex));
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });
    test('MergeConcat_InnerError', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onError(140, ex))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.merge(2);
        });
        results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onNext(440, 7), onNext(460, 8), onError(490, ex));
        xs.subscriptions.assertEqual(subscribe(200, 490));
    });
    test('ZipWithEnumerable_NeverEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1));
        n2 = [];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
        n1.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('ZipWithEnumerable_EmptyEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(210));
        n2 = [];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(210));
        n1.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('ZipWithEnumerable_EmptyNonEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(210));
        n2 = [2];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(210));
        n1.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('ZipWithEnumerable_NonEmptyEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(220));
        n2 = [];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(215));
        n1.subscriptions.assertEqual(subscribe(200, 215));
    });
    test('ZipWithEnumerable_NeverNonEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1));
        n2 = [2];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual();
        n1.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('ZipWithEnumerable_NonEmptyNonEmpty', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(230));
        n2 = [3];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(215, 2 + 3), onCompleted(230));
        n1.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('ZipWithEnumerable_ErrorEmpty', function () {
        var ex, n1, n2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onError(220, ex));
        n2 = [];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
        n1.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('ZipWithEnumerable_ErrorSome', function () {
        var ex, n1, n2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onError(220, ex));
        n2 = [2];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
        n1.subscriptions.assertEqual(subscribe(200, 220));
    });
    test('ZipWithEnumerable_SomeDataBothSides', function () {
        var n1, n2, results, scheduler;
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5));
        n2 = [5, 4, 3, 2];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(210, 7), onNext(220, 7), onNext(230, 7), onNext(240, 7));
        n1.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('ZipWithEnumerable_SelectorThrows', function () {
        var ex, n1, n2, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(240));
        n2 = [3, 5];
        results = scheduler.startWithCreate(function () {
            return n1.zip(n2, function (x, y) {
                if (y === 5) {
                    throw ex;
                }
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(215, 2 + 3), onError(225, ex));
        n1.subscriptions.assertEqual(subscribe(200, 225));
    });

    test("Rx.Observable.catchException() does not lose subscription to underlying observable", 12, function () {
        var subscribes = 0,
                unsubscribes = 0,
                tracer = Rx.Observable.create(function (observer) { ++subscribes; return function () { ++unsubscribes; }; }),
                s;

        // Try it without catchException()
        s = tracer.subscribe();
        strictEqual(subscribes, 1, "1 subscribes");
        strictEqual(unsubscribes, 0, "0 unsubscribes");
        s.dispose();
        strictEqual(subscribes, 1, "After dispose: 1 subscribes");
        strictEqual(unsubscribes, 1, "After dispose: 1 unsubscribes");

        // Now try again with catchException(Observable):
        subscribes = unsubscribes = 0;
        s = tracer.catchException(Rx.Observable.never()).subscribe();
        strictEqual(subscribes, 1, "catchException(Observable): 1 subscribes");
        strictEqual(unsubscribes, 0, "catchException(Observable): 0 unsubscribes");
        s.dispose();
        strictEqual(subscribes, 1, "catchException(Observable): After dispose: 1 subscribes");
        strictEqual(unsubscribes, 1, "catchException(Observable): After dispose: 1 unsubscribes");

        // And now try again with catchException(function()):
        subscribes = unsubscribes = 0;
        s = tracer.catchException(function () { return Rx.Observable.never(); }).subscribe();
        strictEqual(subscribes, 1, "catchException(function): 1 subscribes");
        strictEqual(unsubscribes, 0, "catchException(function): 0 unsubscribes");
        s.dispose();
        strictEqual(subscribes, 1, "catchException(function): After dispose: 1 subscribes");
        strictEqual(unsubscribes, 1, "catchException(function): After dispose: 1 unsubscribes"); // this one FAILS (unsubscribes is 0)
    });

    function sequenceEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    test('Zip_NAry_Symmetric', function () {
        var scheduler = new TestScheduler();

        var e0 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 1), onNext(250, 4), onCompleted(420));
        var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onNext(240, 5), onCompleted(410));
        var e2 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(260, 6), onCompleted(400));

        var res = scheduler.startWithCreate(function () {
            return Observable.zipArray(e0, e1, e2)
        });

        res.messages.assertEqual(
            onNext(230, function(l) { return sequenceEqual(l, [1, 2, 3 ]); }),
            onNext(260, function(l) { return sequenceEqual(l, [4, 5, 6 ]); }),
            onCompleted(420)
        );

        e0.subscriptions.assertEqual(
            subscribe(200, 420)
        );

        e1.subscriptions.assertEqual(
            subscribe(200, 410)
        );

        e2.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });
    
}(typeof global == 'object' && global || this))