    // Check for AMD
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        window.Rx = Rx;
        return define(function () {
            return Rx;
        });
    } else if (freeExports) {
        if (typeof module == 'object' && module && module.exports == freeExports) {
            module.exports = Rx;
        } else {
            freeExports = Rx;
        }
    } else {
        window.Rx = Rx;
    }