(function(window, undefined){
    'use strict';

    //Default configuration options.
    var defaultConfig = {shortCircuit: false};
    //Merged configuration options.
    var config = {};
    var isConfigured = false;
    var queue = [];//Array of callbacks. Calls are sequential. TODO support async.
    var results = [];//Array of results.
    var notedGroup;
    var notedTest;
    var assert;
    var queueCount;
    var interval;
    var intervalId;
    var totGroups = 0;
    var totGroupsPassed = 0;
    var totGroupsFailed = 0;
    var totTests = 0;
    var totTestsPassed = 0;
    var totTestsFailed = 0;
    var totAssertions = 0;
    var totAssertionsPassed = 0;
    var totAssertionsFailed = 0;

    function pluralize(word, count){
        var pluralizer = arguments === 2 ? arguments[1] : 's';
        return count === 0 ? word + pluralizer : count > 1 ? word + pluralizer : word;
    }

    function showTotalsToBeRun(){
        var html = '<p>Queue built.</p><p>Running ' + totAssertions + pluralize(' assertion', totAssertions) + '/' + totTests + pluralize(' test', totTests) +'/' + totGroups + pluralize(' group', totGroups) + '...</p>';
        var $domTarget = $('#header');
        $domTarget.html(html);
    }

    //Configuration
    function configure(){
        // var prop;
        // for(prop in defaultConfig){
        //     if(defaultConfig.hasOwnProperty(prop)){
        //         config[prop] = userConfig.hasOwnProperty(prop) ? userConfig[prop] : defaultConfig[prop];
        //     }
        // }
        config = defaultConfig;
        isConfigured = true;
    }

    function assertionPrettifier(assertion){
        var assertName = assertion.name;
        switch(assertName){
            case 'assertEqual' :
                return ' === ';
            case 'assertNotEqual' :
                return ' !== ';
        }
    }

    function showResultsSummary(){
        var html;
        var $domTarget = $('#header');
        var pre = '<p>Testing has completed.</p>';
        //Show a summary in the header.
        if(totAssertionsFailed === 0){
            html = '<p>' + totAssertionsPassed + pluralize(' assertion', totAssertions) + '/' + totTestsPassed + pluralize(' test', totTestsPassed) + '/' + totGroupsPassed + pluralize(' group', totGroupsPassed) + ' passed, 0 tests failed.' + '</p>';
        }else if(totAssertionsPassed === 0){
            html = '<p> 0 tests passed, ' + totAssertionsFailed + pluralize(' assertion', totAssertionsFailed) + '/' + totTestsFailed + pluralize(' test', totTestsFailed) + '/' + totGroupsFailed + pluralize(' group', totGroupsFailed)  + ' failed.</p>';
        }else{
            html = '<p>' + totAssertionsPassed + pluralize(' assertion', totAssertionsPassed) + '/' + totTestsPassed + pluralize(' test', totTestsPassed) + '/' + totGroupsPassed + pluralize(' group', totGroupsPassed) + ' passed, ' + totAssertionsFailed + pluralize(' assertion', totAssertionsFailed) + '/' + totTestsFailed + pluralize(' test', totTestsFailed) + '/' + totGroupsFailed + pluralize(' group', totGroupsFailed) + ' failed.</p>';
        }
        $domTarget.html(pre + html);
    }

    function showAssertionFailures(){
        //Show failures in the results as a default.
        var $domTarget = $('#results');
        $domTarget.show();
        results.forEach(function(result){
            var html;
            if(!result.result){
                html = '<div class="failed-result">Assertion "' + result.assertionLabel + '" (' + result.assertion.name + ') in test "' + result.testLabel + '", group "' + result.groupLabel + '" failed! Expected "<em>' + result.value + '</em>" ' + assertionPrettifier(result.assertion)  + '"<em>' + result.expectation +  '</em>".</div>';
            }
            $domTarget.append(html);
        });
    }

    function showResults(){
        showResultsSummary();
        if(totAssertionsFailed){
            showAssertionFailures();
        }
    }

    function genTotalsFromResults(){
        var prevGroupLabel;
        var prevTestLabel;
        results.forEach(function(result){
            if(!result.result){
                if(result.groupLabel !== prevGroupLabel){
                    totGroupsFailed++;
                    prevGroupLabel = result.groupLabel;
                }
                if(result.testLabel !== prevTestLabel){
                    totTestsFailed++;
                    prevTestLabel = result.testLabel;
                }
            }
        });
        totTestsPassed = totTests - totTestsFailed;
        totGroupsPassed = totGroups - totGroupsFailed;
    }

    function reporter(){
        genTotalsFromResults();
        showResults();
    }

    function compareArrays(a, b){
        var i,
            len;
        if(Array.isArray(a) && Array.isArray(b)){
            if(a.length !== b.length){
                return false;
            }
            for(i = 0, len = a.length; i < len; i++){
                if(typeof a[i] === 'object' && typeof b[i] === 'object'){
                    if(!compareObjects(a[i], b[i])){
                        return false;
                    }
                    continue;
                }
                if(typeof a[i] === 'object' || typeof b[i] === 'object'){
                    return false;
                }
                if(Array.isArray(a[i]) && Array.isArray(b[i])){
                    if(!compareArrays(a[i], b[i])){
                        return false;
                    }
                    continue;
                }
                if(Array.isArray(a[i]) || Array.isArray(b[i])){
                    return false;
                }
                if(a[i] !== b[i]){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function compareObjects(a, b){
        var prop;
        if(compareArrays(a, b)){
            return true;
        }
        for(prop in a){
            if(a.hasOwnProperty(prop) && b.hasOwnProperty(prop)){
                if(typeof a[prop] === 'object' && typeof b[prop] === 'object'){
                    if(!compareObjects(a[prop], b[prop])){
                        return false;
                    }
                    continue;
                }
                if(typeof a[prop] === 'object' || typeof b[prop] === 'object'){
                    return false;
                }
                if(a[prop] !== b[prop]){
                    return false;
                }
            }else {
                return false;
            }
        }
        return true;
    }

    //Assertions

    function a_equals_b(a, b){
        if(typeof a ==='object' && typeof b === 'object'){
            //Both are object so compare their properties.
            if(compareObjects(a,b) && compareObjects(b,a)) {return true;}
        }
        if(typeof a === 'object'|| typeof b === 'object'){
            //One is an object and the other isn't.
            return false;
        }
        //Both are not object so just compare values.
        return a === b;
    }

    function a_notequals_b(a, b){
        return !a_equals_b(a, b);
    }

    // function a_lessthan_b(a, b){
    //     return a < b;
    // }

    // function a_greaterthan_b(a, b){
    //     return a > b;
    // }

    // function a_greaterthan_b_lessthan_c(a, b, c){
    //     return b < a && c > a;
    // }

    //assertion runner

    // a === b
    function assertEqual(a, b){
        return a_equals_b(a, b);
    }

    function assertNotEqual(a, b){
        return a_notequals_b(a, b);
    }

    function run(){
        var i,
            len,
            item;
        //Synchronously iterate over the queue, running each item's callback.
        for (i = 0, len = queue.length; i < len; i++) {
            item = queue[i];
            console.log('Running asserted defined by: ', item);
            item.result = item.assertion(typeof item.value === 'function' ? item.value() : item.value, item.expectation);
            if(item.result){
                totAssertionsPassed++;
            }else{
                totAssertionsFailed++;
            }
            results.push(item);
            if(config.shortCircuit && totAssertionsFailed){
                return;
            }
        }
    }

    function pushOntoQue(groupLabel, testLabel, assertion, assertionLabel, value, expectation){
        queue.push({groupLabel: groupLabel, testLabel: testLabel, assertion: assertion, assertionLabel: assertionLabel, value: value, expectation: expectation});
    }

    function noteEqualAssertion(value, expectation, label){
        pushOntoQue(notedGroup, notedTest, assertEqual, label, value, expectation);
    }

    function noteNotEqualAssertion(value, expectation, label){
        pushOntoQue(notedGroup, notedTest, assertNotEqual, label, value, expectation);
    }

    //Passed to test's callbacks. Not the real ones, instead the ones that will further update their quue entries.
    assert = {
        equal: noteEqualAssertion,
        notEqual: noteNotEqualAssertion
    };

    //A label for a group of tests.
    window.group = function group(label, callback){
        // debugger;
        notedGroup = label;
        callback();
        notedGroup = '';
    };

    //Adds tests to the queue to be run once the queue is filled.
    window.test = function test(label, callback){
        // debugger;
        notedTest = label;
        callback(assert);
    };

    //Generate totals from items in the queue for total
    //groups, total tests and total assertions. Totals
    //for passed and failed assertions are generated
    //when later in the process when they are run.
    function genTotalsFromQueue(){
        var prevGroupLabel,
            prevTestLabel;
        queue.forEach(function(item){
            if(item.groupLabel !== prevGroupLabel){
                totGroups++;
                prevGroupLabel = item.groupLabel;
            }
            if(item.testLabel !== prevTestLabel){
                totTests++;
                prevTestLabel = item.testLabel;
            }
            totAssertions++;
        });
    }

    function showStartMessage(){
        var $domTarget = $('#header');
        $domTarget.html('<p>Building queue. Please wait...</p>');
    }

    //Called to begin running the tests in the queue.
    function runner(){
        //Queue totals.
        genTotalsFromQueue();
        //Show queue totals while tests are running.
        showTotalsToBeRun();
        //Apply configuration options.
        configure();
        //Timeout to allow user to see total to be run message.
        setTimeout(function(){
            //Run the tests in the queue.
            run();
            console.log(results);
            //Report the results.
            reporter();
        }, 2000);
    }

    //Show the start message.
    showStartMessage();

    //Keep checking the queue until it is 'stabe'. Once stable, run the tests.
    // debugger;
    queueCount = 0;
    interval = 1000;
    intervalId = setInterval(function(){
        if(queue.length === queueCount){
            clearInterval(intervalId);
            runner();
        }else{
            queueCount = queue.length;
        }
    }, interval);


}(window));
