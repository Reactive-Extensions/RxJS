  function combineLatestSource(source, subject, resultSelector) {
    return new AnonymousObservable(function (observer) {
      var n = 2,
        hasValue = [false, false],
        hasValueAll = false,
        isDone = false,
        values = new Array(n);

      function next(x, i) {
        values[i] = x
        var res;
        hasValue[i] = true;
        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
          try {
            res = resultSelector.apply(null, values);
          } catch (ex) {
            observer.onError(ex);
            return;
          }
          observer.onNext(res);
        } else if (isDone) {
          observer.onCompleted();
        }
      }

      return new CompositeDisposable(
        source.subscribe(
          function (x) {
            next(x, 0);
          },
          observer.onError.bind(observer),
          function () {
            isDone = true;
            observer.onCompleted();
          }),
        subject.subscribe(
          function (x) {
            next(x, 1);
          },
          observer.onError.bind(observer))
        );
    });
  }

  var PausableBufferedObservable = (function (_super) {

    inherits(PausableBufferedObservable, _super);

    function subscribe(observer) {
      var q = [], previous = true;
      
      var subscription =  
        combineLatestSource(
          this.source,
          this.subject.distinctUntilChanged(), 
          function (data, shouldFire) {
            return { data: data, shouldFire: shouldFire };      
          })
          .subscribe(
            function (results) {
              if (results.shouldFire && previous) {
                observer.onNext(results.data);
              }
              if (results.shouldFire && !previous) {
                while (q.length > 0) {
                  observer.onNext(q.shift());
                }
                previous = true;
              } else if (!results.shouldFire && !previous) {
                q.push(results.data);
              } else if (!results.shouldFire && previous) {
                previous = false;
              }

            }, 
            function (err) {
              // Empty buffer before sending error
              while (q.length > 0) {
                observer.onNext(q.shift());
              }
              observer.onError(err);
            },
            function () {
              // Empty buffer before sending completion
              while (q.length > 0) {
                observer.onNext(q.shift());
              }
              observer.onCompleted();              
            }
          );

      this.subject.onNext(false);

      return subscription;      
    }

    function PausableBufferedObservable(source, subject) {
      this.source = source;
      this.subject = subject || new Subject();
      this.isPaused = true;
      _super.call(this, subscribe);
    }

    PausableBufferedObservable.prototype.pause = function () {
      if (this.isPaused === true){
        return;
      }
      this.isPaused = true;
      this.subject.onNext(false);
    };

    PausableBufferedObservable.prototype.resume = function () {
      if (this.isPaused === false){
        return;
      }
      this.isPaused = false;
      this.subject.onNext(true);
    };

    return PausableBufferedObservable; 

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
   * and yields the values that were buffered while paused.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */  
  observableProto.pausableBuffered = function (subject) {
    return new PausableBufferedObservable(this, subject);
  };
