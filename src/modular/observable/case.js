'use strict';

var defer = require('./defer');
var empty = require('./empty');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var isScheduler = require('../scheduler').isScheduler;

function createCase(selector, sources, defaultSourceOrScheduler) {
  return function () {
    isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = fromPromise(defaultSourceOrScheduler));
    defaultSourceOrScheduler || (defaultSourceOrScheduler = empty());

    isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = empty(defaultSourceOrScheduler));

    var result = sources[selector()];
    isPromise(result) && (result = fromPromise(result));

    return result || defaultSourceOrScheduler;
  };
}

/**
*  Uses selector to determine which source in sources to use.
* @param {Function} selector The function which extracts the value for to test in a case statement.
* @param {Array} sources A object which has keys which correspond to the case statement labels.
* @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
*
* @returns {Observable} An observable sequence which is determined by a case statement.
*/
module.exports = function case_(selector, sources, defaultSourceOrScheduler) {
 return defer(createCase(selector, sources, defaultSourceOrScheduler));
};
