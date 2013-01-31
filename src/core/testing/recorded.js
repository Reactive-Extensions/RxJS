    /**
     * @constructor
     * Creates a new object recording the production of the specified value at the given virtual time.
     * 
     * @param time Virtual time the value was produced on.
     * @param value Value that was produced.
     * @param comparer An optional comparer.
     */
    var Recorded = root.Recorded = function (time, value, comparer) {
        this.time = time;
        this.value = value;
        this.comparer = comparer || defaultComparer;
    };

    /**
     * Checks whether the given recorded object is equal to the current instance.
     * @param other Recorded object to check for equality.
     * @return true if both objects are equal; false otherwise.  
     */  
    Recorded.prototype.equals = function (other) {
        return this.time === other.time && this.comparer(this.value, other.value);
    };

    /**
     * Returns a string representation of the current Recorded value.
     * @return String representation of the current Recorded value. 
     */   
    Recorded.prototype.toString = function () {
        return this.value.toString() + '@' + this.time;
    };
