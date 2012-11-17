    var Recorded = root.Recorded = function (time, value, comparer) {
        this.time = time;
        this.value = value;
        this.comparer = comparer || defaultComparer;
    };
    Recorded.prototype.equals = function (other) {
        return this.time === other.time && this.comparer(this.value, other.value);
    };
    Recorded.prototype.toString = function () {
        return this.value.toString() + '@' + this.time;
    };
