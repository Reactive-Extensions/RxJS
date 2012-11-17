module.exports = function (grunt) {

    grunt.initConfig({
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
            basic: {
                src: [
                    'src/core/license.js',
                    'src/core/intro.js',
                    'src/core/basicheader.js',
                    'src/core/internal/polyfills.js',
                    'src/core/internal/priorityqueue.js',
                    'src/core/disposables/compositedisposable.js',
                    'src/core/disposables/disposable.js',
                    'src/core/disposables/singleassignmentdisposable.js',
                    'src/core/disposables/serialdisposable.js',
                    'src/core/disposables/refcountdisposable.js',
                    'src/core/disposables/scheduleddisposable.js',
                    'src/core/concurrency/scheduleditem.js',
                    'src/core/concurrency/scheduler.js',
                    'src/core/concurrency/immediatescheduler.js',
                    'src/core/concurrency/currentthreadscheduler.js',
                    'src/core/concurrency/scheduleperiodicrecursive.js',
                    'src/core/concurrency/virtualtimescheduler.js',
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
                    'src/core/linq/observable.async.js',
                    'src/core/linq/observable.concurrency.js',
                    'src/core/linq/observable.creation.js',
                    'src/core/linq/observable.multiple.js',
                    'src/core/linq/observable.single.js',
                    'src/core/linq/observable.standardsequenceoperators.js',
                    'src/core/anonymousobservable.js',
                    'src/core/autodetachobserver.js',
                    'src/core/linq/groupedobservable.js',
                    'src/core/subjects/innersubscription.js',
                    'src/core/subjects/subject.js',
                    'src/core/subjects/asyncsubject.js',
                    'src/core/subjects/anonymoussubject.js',
                    'src/core/exports.js',
                    'src/core/outro.js'
                ],
                dest: 'rx.js'
            },
            basicDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/intro.js',
                    'src/core/basicheader.js',
                    'src/core/internal/polyfills.js',
                    'src/core/internal/priorityqueue.js',
                    'src/core/disposables/compositedisposable-vsdoc.js',
                    'src/core/disposables/disposable-vsdoc.js',
                    'src/core/disposables/singleassignmentdisposable-vsdoc.js',
                    'src/core/disposables/serialdisposable-vsdoc.js',
                    'src/core/disposables/refcountdisposable-vsdoc.js',
                    'src/core/disposables/scheduleddisposable.js',
                    'src/core/concurrency/scheduleditem.js',
                    'src/core/concurrency/scheduler-vsdoc.js',
                    'src/core/concurrency/immediatescheduler.js',
                    'src/core/concurrency/currentthreadscheduler.js',
                    'src/core/concurrency/scheduleperiodicrecursive.js',
                    'src/core/concurrency/virtualtimescheduler-vsdoc.js',
                    'src/core/concurrency/timeoutscheduler.js',
                    'src/core/concurrency/catchscheduler.js',
                    'src/core/notification-vsdoc.js',
                    'src/core/internal/enumerator.js',
                    'src/core/internal/enumerable.js',
                    'src/core/observer-vsdoc.js',
                    'src/core/abstractobserver-vsdoc.js',
                    'src/core/anonymousobserver-vsdoc.js',
                    'src/core/checkedobserver.js',
                    'src/core/scheduledobserver.js',
                    'src/core/observeonobserver.js',
                    'src/core/observable-vsdoc.js',
                    'src/core/linq/observable.async-vsdoc.js',
                    'src/core/linq/observable.concurrency-vsdoc.js',
                    'src/core/linq/observable.creation-vsdoc.js',
                    'src/core/linq/observable.multiple-vsdoc.js',
                    'src/core/linq/observable.single-vsdoc.js',
                    'src/core/linq/observable.standardsequenceoperators-vsdoc.js',
                    'src/core/anonymousobservable.js',
                    'src/core/autodetachobserver.js',
                    'src/core/linq/groupedobservable.js',
                    'src/core/subjects/innersubscription.js',
                    'src/core/subjects/subject-vsdoc.js',
                    'src/core/subjects/asyncsubject.js',
                    'src/core/subjects/anonymoussubject.js',
                    'src/core/exports.js',
                    'src/core/outro.js'
                ],
                dest: 'rx-vsdoc.js'
            },
            aggregates: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/aggregatesheader.js',
                    'src/core/linq/observable.aggregates.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.aggregates.js'
            },
            aggregatesDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/aggregatesheader.js',
                    'src/core/linq/observable.aggregates-vsdoc.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.aggregates-vsdoc.js'
            },
            binding: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/linq/observable.binding.js',
                    'src/core/subjects/innersubscription.js',
                    'src/core/subjects/behaviorsubject.js',
                    'src/core/subjects/replaysubject.js',
                    'src/core/linq/connectableobservable.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.binding.js'
            },
            bindingDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/linq/observable.binding-vsdoc.js',
                    'src/core/subjects/innersubscription.js',
                    'src/core/subjects/behaviorsubject-vsdoc.js',
                    'src/core/subjects/replaysubject-vsdoc.js',
                    'src/core/linq/connectableobservable.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.binding-vsdoc.js'
            },
            coincidence: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/coincidenceheader.js',
                    'src/core/internal/dictionary.js',
                    'src/core/linq/observable.coincidence.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.coincidence.js'
            },
            coincidenceDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/coincidenceheader.js',
                    'src/core/internal/dictionary.js',
                    'src/core/linq/observable.coincidence.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.coincidence-vsdoc.js'
            },
            experimental: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/experimentalheader.js',
                    'src/core/linq/observable.experimental.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.experimental.js'
            },
            experimentalDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/experimentalheader.js',
                    'src/core/linq/observable.experimental-vsdoc.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.experimental-vsdoc.js'
            },
            joinpatterns: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/joinpatternsheader.js',
                    'src/core/internal/map.js',
                    'src/core/joins/pattern.js',
                    'src/core/joins/plan.js',
                    'src/core/joins/activeplan.js',
                    'src/core/joins/joinobserver.js',
                    'src/core/linq/observable.joins.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.joinpatterns.js'
            },
            joinpatternsDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/joinpatternsheader.js',
                    'src/core/internal/map.js',
                    'src/core/joins/pattern-vsdoc.js',
                    'src/core/joins/plan.js',
                    'src/core/joins/activeplan.js',
                    'src/core/joins/joinobserver.js',
                    'src/core/linq/observable.joins-vsdoc.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.joinpatterns-vsdoc.js'
            },
            testing: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/testheader.js',
                    'src/core/testing/reactivetest.js',
                    'src/core/testing/recorded.js',
                    'src/core/testing/subscription.js',
                    'src/core/testing/mockdisposable.js',
                    'src/core/testing/mockobserver.js',
                    'src/core/testing/hotobservable.js',
                    'src/core/testing/coldobservable.js',
                    'src/core/testing/testscheduler.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.testing.js'
            },
            testingDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/testheader.js',
                    'src/core/testing/reactivetest-vsdoc.js',
                    'src/core/testing/recorded-vsdoc.js',
                    'src/core/testing/subscription-vsdoc.js',
                    'src/core/testing/mockdisposable.js',
                    'src/core/testing/mockobserver.js',
                    'src/core/testing/hotobservable.js',
                    'src/core/testing/coldobservable.js',
                    'src/core/testing/testscheduler-vsdoc.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.testing-vsdoc.js'
            },
            time: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/timeheader.js',
                    'src/core/linq/observable.time.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.time.js'
            },
            timeDocs: {
                src: [
                    'src/core/license.js',
                    'src/core/subintro.js',
                    'src/core/timeheader.js',
                    'src/core/linq/observable.time-vsdoc.js',
                    'src/core/suboutro.js'
                ],
                dest: 'rx.time-vsdoc.js'
            },
        },
        min: {
            basic: {
                src: ['<banner>', 'rx.js'],
                dest: 'rx.min.js'
            },
            aggregates: {
                src: ['<banner>', 'rx.aggregates.js'],
                dest: 'rx.aggregates.min.js'
            },
            binding: {
                src: ['<banner>', 'rx.binding.js'],
                dest: 'rx.binding.min.js'
            },
            coincidence: {
                src: ['<banner>', 'rx.coincidence.js'],
                dest: 'rx.coincidence.min.js'
            },
            experimental: {
                src: ['<banner>', 'rx.experimental.js'],
                dest: 'rx.experimental.min.js'
            },
            joinpatterns: {
                src: ['<banner>', 'rx.joinpatterns.js'],
                dest: 'rx.joinpatterns.min.js'
            },
            testing: {
                src: ['<banner>', 'rx.testing.js'],
                dest: 'rx.testing.min.js'
            },
            time: {
                src: ['<banner>', 'rx.time.js'],
                dest: 'rx.time.min.js'
            }

        },
        qunit: {
            all: ['tests/*.html']
        }
    });

    var defaultTasks = [
        'concat:basic',
        'concat:aggregates',
        'concat:binding',
        'concat:coincidence',
        'concat:experimental',
        'concat:joinpatterns',
        'concat:time',
        'concat:testing',

        'concat:basicDocs',
        'concat:aggregatesDocs',
        'concat:bindingDocs',
        'concat:coincidenceDocs',
        'concat:experimentalDocs',
        'concat:joinpatternsDocs',
        'concat:timeDocs',
        'concat:testingDocs',

        'min:basic',
        'min:aggregates',
        'min:binding',
        'min:coincidence',
        'min:experimental',
        'min:joinpatterns',
        'min:testing',
        'min:time',

        'qunit'
    ].join(' ');
    grunt.registerTask('default', defaultTasks);

};