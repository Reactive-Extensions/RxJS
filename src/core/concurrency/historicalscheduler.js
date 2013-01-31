    /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
    root.HistoricalScheduler = (function () {
        inherits(HistoricalScheduler, root.VirtualTimeScheduler);

        /**
         * @constructor
         * Creates a new historical scheduler with the specified initial clock value.
         * 
         * @param initialClock Initial value for the clock.
         * @param comparer Comparer to determine causality of events based on absolute time.
         */
        function HistoricalScheduler(initialClock, comparer) {
            var clock = initialClock == null ? 0 : initialClock;
            var cmp = comparer || defaultSubComparer;
            HistoricalScheduler.super_.constructor.call(this, clock, cmp);
        }

        var HistoricalSchedulerProto = HistoricalScheduler.prototype;

        /**
         * Adds a relative time value to an absolute time value.
         * 
         * @param absolute Absolute virtual time value.
         * @param relative Relative virtual time value to add.
         * @return Resulting absolute virtual time sum value.
         */
        HistoricalSchedulerProto.add = function (absolute, relative) {
            return absolute + relative;
        };

        HistoricalSchedulerProto.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime();
        };

        /**
         * Converts the TimeSpan value to a relative virtual time value.
         * 
         * @param timeSpan TimeSpan value to convert.
         * @return Corresponding relative virtual time value.
         */
        HistoricalSchedulerProto.toRelative = function (timeSpan) {
            return timeSpan;
        };

        return HistoricalScheduler;    
    }());