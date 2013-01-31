    /**
     * @constructor
     * Creates a new subscription object with the given virtual subscription and unsubscription time.
     * @param subscribe Virtual time at which the subscription occurred.
     * @param unsubscribe Virtual time at which the unsubscription occurred.
     */
    var Subscription = root.Subscription = function (start, end) {
        this.subscribe = start;
        this.unsubscribe = end || Number.MAX_VALUE;
    };

    /**
     * Checks whether the given subscription is equal to the current instance.
     * @param other Subscription object to check for equality.
     * @return true if both objects are equal; false otherwise.
     */
    Subscription.prototype.equals = function (other) {
        return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
    };

    /**
     * Returns a string representation of the current Subscription value.
     * @return String representation of the current Subscription value.
     */
    Subscription.prototype.toString = function () {
        return '(' + this.subscribe + ', ' + this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe + ')';
    };
