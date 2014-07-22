    /**
     * @constructor
     * Represents a join pattern over observable sequences.
     */
    function Pattern(patterns) {
        this.patterns = patterns;
    }

    /**
     *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
     *  
     *  @param other Observable sequence to match in addition to the current pattern.
     *  @return Pattern object that matches when all observable sequences in the pattern have an available value.   
     */ 
    Pattern.prototype.and = function (other) {
        var patterns = this.patterns.slice(0);
        patterns.push(other);
        return new Pattern(patterns);
    };

    /**
     *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
     *  
     *  @param selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
     *  @return Plan that produces the projected values, to be fed (with other plans) to the when operator.
     */
    Pattern.prototype.thenDo = function (selector) {
        return new Plan(this, selector);
    };
