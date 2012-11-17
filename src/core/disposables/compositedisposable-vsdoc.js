    var CompositeDisposable = root.CompositeDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the CompositeDisposable class from a group of disposables as an argument array or splat.
        /// </summary>
        this.disposables = argsOrArray(arguments, 0);
        this.isDisposed = false;
        this.length = this.disposables.length;
    };
    CompositeDisposable.prototype.add = function (item) {
        /// <summary>
        /// Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
        /// </summary>
        /// <param name="item">Disposable to add.</param>
        if (this.isDisposed) {
            item.dispose();
        } else {
            this.disposables.push(item);
            this.length++;
        }
    };
    CompositeDisposable.prototype.remove = function (item) {
        /// <summary>
        /// Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
        /// </summary>
        /// <param name="item">Disposable to remove.</param>
        /// <returns>true if found; false otherwise.</returns>
        var shouldDispose = false;
        if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
                shouldDispose = true;
                this.disposables.splice(idx, 1);
                this.length--;
                item.dispose();
            }

        }
        return shouldDispose;
    };
    CompositeDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes all disposables in the group and removes them from the group.
        /// </summary>
        if (!this.isDisposed) {
            this.isDisposed = true;
            var currentDisposables = this.disposables.slice(0);
            this.disposables = [];
            this.length = 0;

            for (var i = 0, len = currentDisposables.length; i < len; i++) {
                currentDisposables[i].dispose();
            }
        }
    };
    CompositeDisposable.prototype.clear = function () {
        /// <summary>
        /// Removes and disposes all disposables from the CompositeDisposable, but does not dispose the CompositeDisposable.
        /// </summary>
        var currentDisposables = this.disposables.slice(0);
        this.disposables = [];
        this.length = 0;
        for (var i = 0, len = currentDisposables.length; i < len; i++) {
            currentDisposables[i].dispose();
        }
    };
    CompositeDisposable.prototype.contains = function (item) {
        /// <summary>
        /// Determines whether the CompositeDisposable contains a specific disposable.
        /// </summary>
        /// <param name="item">Disposable to search for.</param>
        /// <returns>true if the disposable was found; otherwise, false.</returns>
        return this.disposables.indexOf(item) !== -1;
    };
    CompositeDisposable.prototype.toArray = function () {
        /// <summary>
        /// Converts the existing CompositeDisposable to an array of disposables
        /// </summary>
        /// <returns>An array of disposable objects.</returns>
        return this.disposables.slice(0);
    };
