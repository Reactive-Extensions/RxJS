    var Subscription = root.Subscription = function (start, end) {
        /// <summary>
        /// Creates a new subscription object with the given virtual subscription and unsubscription time.
        /// </summary>
        /// <param name="subscribe">Virtual time at which the subscription occurred.</param>
        /// <param name="unsubscribe">Virtual time at which the unsubscription occurred.</param>
        this.subscribe = start;
        this.unsubscribe = end || Number.MAX_VALUE;
    };
    Subscription.prototype.equals = function (other) {
        /// <summary>
        /// Checks whether the given subscription is equal to the current instance.
        /// </summary>
        /// <param name="other">Subscription object to check for equality.</param>
        /// <returns>true if both objects are equal; false otherwise.</returns>
        return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
    };
    Subscription.prototype.toString = function () {
        /// <summary>
        /// Returns a string representation of the current Subscription value.
        /// </summary>
        /// <returns>String representation of the current Subscription value.</returns>
        return '(' + this.subscribe + ', ' + this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe + ')';
    };
