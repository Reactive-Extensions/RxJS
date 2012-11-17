    // Pattern
    function Pattern(patterns) {
        this.patterns = patterns;
    }
    Pattern.prototype.and = function (other) {
        /// <summary>
        /// Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        /// </summary>
        /// <param name="other">Observable sequence to match in addition to the current pattern.</param>
        /// <returns>Pattern object that matches when all observable sequences in the pattern have an available value.</returns>
        var patterns = this.patterns.slice(0);
        patterns.push(other);
        return new Pattern(patterns);
    };
    Pattern.prototype.then = function (selector) {
        /// <summary>
        /// Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        /// </summary>
        /// <param name="selector">Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.</param>
        /// <returns>Plan that produces the projected values, to be fed (with other plans) to the when operator.</returns>
        return new Plan(this, selector);
    };
