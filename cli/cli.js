#!/usr/bin/env node

var grunt = require('grunt');
var program = require('commander');
var dependencies = require('./dependencies.json');

// Program end
var requiredEnd = require('./footer');

program
  .version('0.0.1')
  .option('-m, --methods <methods>', 'Include methods')
  .option('-c, --compat', 'Create compat build');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ cli --methods create,filter,map,flatmap,takeuntil');
  console.log('    $ cli -m create,filter,map,flatmap,takeuntil');
  console.log('');
});

program.parse(process.argv);

var requiredFiles = [];
if (program.methods) {
  
  // Expect commas to seperate methods
  var files = program.methods.split(',');

  for (var i = 0, len = files.length; i < len; i++) {
    var file = files[i];

    // TODO: Add each file
  }
}

var requiredStart = program.compat ?
  require('./headercompat') :
  require('./header');

var totalFiles = requiredStart.concat(requiredFiles, requiredEnd);

var outputFile = 'rx.custom.js';
var outputMinFile = 'rx.custom.min.js';

grunt.initConfig({
  pkg: grunt.file.readJSON('../package.json'),
  meta: {
    banner:
      '/*'+
      'Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.\r\n' +
      'Microsoft Open Technologies would like to thank its contributors, a list.\r\n' +
      'of whom are at http://aspnetwebstack.codeplex.com/wikipage?title=Contributors..\r\n' +
      'Licensed under the Apache License, Version 2.0 (the "License"); you.\r\n' +
      'may not use this file except in compliance with the License. You may.\r\n' +
      'obtain a copy of the License at.\r\n\r\n' +
      'http://www.apache.org/licenses/LICENSE-2.0.\r\n\r\n' +
      'Unless required by applicable law or agreed to in writing, software.\r\n' +
      'distributed under the License is distributed on an "AS IS" BASIS,.\r\n' +
      'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or.\r\n' +
      'implied. See the License for the specific language governing permissions.\r\n' +
      'and limitations under the License..\r\n' +
      '*/'
  },
  concat: {
    main: {
      src: totalFiles,
      dest: outputFile
    }
  },
  uglify: {
    main: {
      src: ['<banner>', outputFile],
      dest: outputMinFile         
    }
  }
});

// Load all "grunt-*" tasks
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');

// Default task
grunt.task.registerTask('custombuild', [
  'concat:main',
  'uglify:main'
]);

grunt.tasks([ 'custombuild' ], { gruntfile: false, verbose: true }, function () { 
  console.log('done');
});