    /**
     * Attaches a stop and wait observable to the current observable.
     * @returns {Observable} A stop and wait observable.
     */
    observableProto.stopAndWait = function () {
        return new StopAndWaitObservable(this);
    };