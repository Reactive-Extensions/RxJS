    // Pattern
    function Pattern(patterns) {
        this.patterns = patterns;
    }
    Pattern.prototype.and = function (other) {
        var patterns = this.patterns.slice(0);
        patterns.push(other);
        return new Pattern(patterns);
    };
    Pattern.prototype.then = function (selector) {
        return new Plan(this, selector);
    };
