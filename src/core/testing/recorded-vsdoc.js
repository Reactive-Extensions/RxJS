    var Recorded = root.Recorded = function (time, value, comparer) {
        /// <summary>
        /// Creates a new object recording the production of the specified value at the given virtual time.
        /// </summary>
        /// <param name="time">Virtual time the value was produced on.</param>
        /// <param name="value">Value that was produced.</param>
        /// <param name="comparer">An optional comparer.</param>
        this.time = time;
        this.value = value;
        this.comparer = comparer || defaultComparer;
    };
    Recorded.prototype.equals = function (other) {
        /// <summary>
        /// Checks whether the given recorded object is equal to the current instance.
        /// </summary>
        /// <param name="other">Recorded object to check for equality.</param>
        /// <returns>true if both objects are equal; false otherwise.</returns>
        return this.time === other.time && this.comparer(this.value, other.value);
    };
    Recorded.prototype.toString = function () {
        /// <summary>
        /// Returns a string representation of the current Recorded value.
        /// </summary>
        /// <returns>String representation of the current Recorded value.</returns>
        return this.value.toString() + '@' + this.time;
    };
