    /**
     *  Projects each element of an observable sequence into zero or more windows.
     *  
     *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
     *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
     *  @returns {Observable} An observable sequence of windows.
     */    
    observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
        if (arguments.length === 1 && typeof arguments[0] !== 'function') {
            return observableWindowWithBounaries.call(this, windowOpeningsOrClosingSelector);
        }
        return typeof windowOpeningsOrClosingSelector === 'function' ?
            observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
            observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
    };
    
    function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
        return windowOpenings.groupJoin(this, windowClosingSelector, function () {
            return observableEmpty();
        }, function (_, window) {
            return window;
        });
    }

    function observableWindowWithBounaries(windowBoundaries) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var window = new Subject(), 
                d = new CompositeDisposable(), 
                r = new RefCountDisposable(d);

            observer.onNext(addRef(window, r));

            d.add(source.subscribe(function (x) {
                window.onNext(x);
            }, function (err) {
                window.onError(err);
                observer.onError(err);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));

            d.add(windowBoundaries.subscribe(function (w) {
                window.onCompleted();
                window = new Subject();
                observer.onNext(addRef(window, r));
            }, function (err) {
                window.onError(err);
                observer.onError(err);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));

            return r;
        });
    }

    function observableWindowWithClosingSelector(windowClosingSelector) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var createWindowClose,
                m = new SerialDisposable(),
                d = new CompositeDisposable(m),
                r = new RefCountDisposable(d),
                window = new Subject();
            observer.onNext(addRef(window, r));
            d.add(source.subscribe(function (x) {
                window.onNext(x);
            }, function (ex) {
                window.onError(ex);
                observer.onError(ex);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));
            createWindowClose = function () {
                var m1, windowClose;
                try {
                    windowClose = windowClosingSelector();
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                m1 = new SingleAssignmentDisposable();
                m.setDisposable(m1);
                m1.setDisposable(windowClose.take(1).subscribe(noop, function (ex) {
                    window.onError(ex);
                    observer.onError(ex);
                }, function () {
                    window.onCompleted();
                    window = new Subject();
                    observer.onNext(addRef(window, r));
                    createWindowClose();
                }));
            };
            createWindowClose();
            return r;
        });
    }
