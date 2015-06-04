// TODO: Refactor longStackSupport and hasStacks
var Rx.config = {
  longStackSupport = false;
};
var hasStacks = false;

function Observable(subscribe) {
  if (Rx.config.longStackSupport && hasStacks) {
    try {
      throw new Error();
    } catch (e) {
      this.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
    }

    var self = this;
    this._subscribe = function (observer) {
      var oldOnError = observer.onError.bind(observer);

      observer.onError = function (err) {
        makeStackTraceLong(err, self);
        oldOnError(err);
      };

      return subscribe.call(self, observer);
    };
  } else {
    this._subscribe = subscribe;
  }
}

// Class methods
Observable['amb'] = require('./observable/amb');
Observable['case'] = require('./observable/case');
Observable['catch'] = require('./observable/catch');
Observable['create'] = require('./observable/create');
Observable['combineLatest'] = require('./observable/combinelatest');
Observable['concat'] = require('./observable/concat');
Observable['defer'] = require('./observable/defer');
Observable['empty'] = require('./observable/empty');
Observable['for'] = require('./observable/for');
Observable['forkJoin'] = require('./observable/forkjoin');
Observable['from'] = require('./observable/from');
Observable['fromArray'] = require('./observable/fromarray');
Observable['fromCallback'] = require('./observable/fromcallback');
Observable['fromEvent'] = require('./observable/fromevent');
Observable['fromEventPattern'] = require('./observable/fromeventpattern');
Observable['fromNodeCallback'] = require('./observable/fromnodecallback');
Observable['fromPromise'] = require('./observable/frompromise');
Observable['generate'] = require('./observable/generate');
Observable['generateWithAbsoluteTime'] = require('./observable/generatewithabsolutetime');
Observable['generateWithRelativeTime'] = require('./observable/generatewithrelativetime');
Observable['if'] = require('./observable/if');
Observable['interval'] = require('./observable/interval');
Observable['just'] = require('./observable/just');
Observable['merge'] = require('./observable/merge');
Observable['never'] = require('./observable/never');
Observable['of'] = require('./observable/of');
Observable['ofArrayChanges'] = require('./observable/ofarraychanges');
Observable['ofObjectChanges'] = require('./observable/ofobjectchanges');
Observable['onErrorResumeNext'] = require('./observable/onerrorresumenext');
Observable['pairs'] = require('./observable/pairs');
Observable['range'] = require('./observable/range');
Observable['repeat'] = require('./observable/repeat');
Observable['spawn'] = require('./observable/spawn');
Observable['throw'] = require('./observable/throw');
Observable['timer'] = require('./observable/timer');
Observable['toAsync'] = require('./observable/toasync');
Observable['using'] = require('./observable/using');
Observable['when'] = require('./observable/when');
Observable['zip'] = require('./observable/zip');

// Instance methods



module.exports = Observable;
