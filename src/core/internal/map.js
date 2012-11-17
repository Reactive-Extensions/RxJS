    // TODO: Replace with a real Map once finalized
    var Map = (function () {
        function Map() {
            this.keys = [];
            this.values = [];
        }

        Map.prototype['delete'] = function (key) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
            }
            return i !== -1;
        };

        Map.prototype.get = function (key, fallback) {
            var i = this.keys.indexOf(key);
            return i !== -1 ? this.values[i] : fallback;
        };

        Map.prototype.set = function (key, value) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.values[i] = value;
            }
            this.values[this.keys.push(key) - 1] = value;
        };

        Map.prototype.size = function () { return this.keys.length; };
        Map.prototype.has = function (key) {
            return this.keys.indexOf(key) !== -1;
        };
        Map.prototype.getKeys = function () { return this.keys.slice(0); };
        Map.prototype.getValues = function () { return this.values.slice(0); };

        return Map;
    }());
