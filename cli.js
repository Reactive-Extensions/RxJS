#!/usr/bin/env node

var grunt = require('grunt');
var program = require('commander');
var dependencies = require('./cli/dependencies.json');

// Program start
var requiredStart = [
  'src/core/license.js',
  'src/core/intro.js',
  'src/core/basicheader-modern.js',
  'src/core/enumeratorheader.js',
  'src/core/internal/isequal.js',
  'src/core/internal/util.js',
  'src/core/internal/priorityqueue.js',
  'src/core/disposables/compositedisposable.js',
  'src/core/disposables/disposable.js',
  'src/core/disposables/booleandisposable.js',
  'src/core/disposables/singleassignmentdisposable.js',
  'src/core/disposables/serialdisposable.js',
  'src/core/disposables/refcountdisposable.js',
  'src/core/disposables/scheduleddisposable.js',
  'src/core/concurrency/scheduleditem.js',
  'src/core/concurrency/scheduler.js',
  'src/core/concurrency/scheduleperiodicrecursive.js',
  'src/core/concurrency/immediatescheduler.js',
  'src/core/concurrency/currentthreadscheduler.js',
  'src/core/concurrency/timeoutscheduler.js',
  'src/core/concurrency/catchscheduler.js',
  'src/core/notification.js',
  'src/core/internal/enumerator.js',
  'src/core/internal/enumerable.js',
  'src/core/observer.js',
  'src/core/abstractobserver.js',
  'src/core/anonymousobserver.js',
  'src/core/checkedobserver.js',
  'src/core/scheduledobserver.js',
  'src/core/observeonobserver.js',
  'src/core/observable.js',
  'src/core/linq/observable/create.js',
];

var requiredEnd = [
  'src/core/anonymousobservable.js',
  'src/core/autodetachobserver.js',
  'src/core/linq/groupedobservable.js',
  'src/core/subjects/innersubscription.js',
  'src/core/subjects/subject.js',
  'src/core/subjects/asyncsubject.js',
  'src/core/subjects/anonymoussubject.js',
  'src/core/exports.js',
  'src/core/outro.js' 
];

program
  .version('0.0.1')
  .option('-o, --operators <operators>', 'Include operators');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ cli --operators create,filter,map,flatmap,takeuntil');
  console.log('    $ cli -o create,filter,map,flatmap,takeuntil');
  console.log('');
});

program.parse(process.argv);

if (program.operators) {
  var requiredFiles = [];

  // Expect commas to seperate operators
  var files = program.operators.split(',');

  for (var i = 0, len = files.length; i < len; i++) {
    var file = files[i];
  }

  var totalFiles = requiredStart.concat(requiredFiles, requiredEnd);

  // TODO: Launch grunt with config, concat, uglify
}
