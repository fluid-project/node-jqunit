/*
Copyright 2010-2012 OCAD University
Copyright 2010-2012 Antranig Basman

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt

Includes code from Underscore.js 1.4.3
http://underscorejs.org
(c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
Underscore may be freely distributed under the MIT license.
*/

"use strict";

var fluid = require("infusion");

fluid.loadTestingSupport();
fluid.setLogging(true);

// Debugging definition - node.js's default is only 10! TODO - place these into Infusion itself
fluid.Error.stackTraceLimit = 100;
Error.stackTraceLimit = 100;

var QUnit = fluid.registerNamespace("QUnit");
var jqUnit = fluid.registerNamespace("jqUnit");

jqUnit.nodeFailureHandler = function (args, activity) {
    if (QUnit.config.current) {
        QUnit.ok(false, "Assertion failure (see console.log for expanded message): ".concat(args));
    } else {
        jqUnit.globalFailure = args;
    }
    fluid.builtinFail(args, activity);
    // Note that since Infusion has overriden node's global uncaught exception handler, the process will not exit here
};

fluid.failureEvent.addListener(jqUnit.nodeFailureHandler, "jqUnit", "before:fail");

QUnit.load();

// patch this function so it is not confused by the presence of the vestigial jQuery
QUnit.reset = fluid.identity;
// ensure that QUnit does not attempt to start synchronously and hence confuse the queue
// hack inside the IoC testing system
QUnit.config.autorun = false;

// Begin callbacks for test state

var colors = fluid.registerNamespace("colors");

colors.styles = {
    //styles
    "bold"      : [1,  22],
    "italic"    : [3,  23],
    "underline" : [4,  24],
    "inverse"   : [7,  27],
    //grayscale
    "white"     : [37, 39],
    "grey"      : [90, 39],
    "black"     : [90, 39],
    //colors
    "blue"      : [34, 39],
    "cyan"      : [36, 39],
    "green"     : [32, 39],
    "magenta"   : [35, 39],
    "red"       : [31, 39],
    "yellow"    : [33, 39]
};

// stolen from "colors" npm module which grubbily works by polluting global prototypes
colors.stylize = function (str, styles) {
    styles = fluid.makeArray(styles);

    var togo = str;
    for (var i = 0; i < styles.length; ++i) {
        togo = "\u001b[" + colors.styles[styles[i]][0] + "m" + togo +
            "\u001b[" + colors.styles[styles[i]][1] + "m";
    }
    return togo;
};

var testState = {
    currentModule: "",
    assertions: [],
    tests: [],
    global: null
};

QUnit.testStart(function (test) {
    testState.currentModule = test.module || "";
});

jqUnit.log = function () {
    var args = fluid.makeArray(arguments);
    args.unshift("jq: ");
    fluid.log.apply(null, args);
};

jqUnit.applyStyles = process.stdout.isTTY; // don't apply colour styles if not outputting to terminal

jqUnit.stylize = function (str, styles) {
    return jqUnit.applyStyles ? colors.stylize(str, styles) : str;
};

jqUnit.onAllTestsDone = fluid.makeEventFirer();

jqUnit.renderTestName = function (data, member) {
    return (data.module ? "Module \"" + data.module + "\" " : "") + "Test name \"" + data[member] + "\"";
};

jqUnit.passFail = function (failures) {
    return failures === 0 ? jqUnit.stylize("PASS", ["green", "bold"]) : jqUnit.stylize("FAIL", ["red", "bold"]);
};

jqUnit.passCount = function (data) {
    return data.passed + "/" + data.total;
};

/**
 * Callback for each assertion.
 * @param {Object} data
 */
QUnit.log(function (data) {
    data.test = QUnit.config.current.testName;
    data.module = testState.currentModule;
    testState.assertions.push(data);
    if (!data.result) {
        jqUnit.log(jqUnit.passFail(1) + ": " + jqUnit.renderTestName(data, "test") + " - Message: " + data.message);
        if (data.expected !== undefined) {
            jqUnit.log("Expected: ", data.expected);
            jqUnit.log("Actual: ", data.actual);
        }
        if (data.source) {
            jqUnit.log("Source: " + data.source);
        }
    }
});

/**
 * Callback for one done test.
 * @param {Object} test
 */
QUnit.testDone(function (data) {
    // use last module name if no module name defined
    data.module = data.module || testState.currentModule;
    testState.tests.push(data);
    jqUnit.log("Test concluded - " + jqUnit.renderTestName(data, "name") + ": " + jqUnit.passCount(data) + " passed - " +
        jqUnit.passFail(data.failed));
});

// Stolen from Underscore.js 1.4.3 - see licence at head of this file
/* jshint ignore:start */
fluid.debounce = function (func, wait, immediate) {
    var timeout, result;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
    };
};
/* jshint ignore:end */

jqUnit.allTestsDone = function (data) {
    if (jqUnit.globalFailure) {
        ++data.failed;
        ++data.total;
    }
    testState.global = data;
    var success = data.failed === 0 && data.total !== 0;
    var separator = jqUnit.stylize("***************", [success ? "green" : "red", "bold"]);
    jqUnit.log(separator);
    if (data.total === 0) {
        jqUnit.log("Failure in fixture file - no tests were queued - " + jqUnit.passFail(1));
    } else {
        jqUnit.log("All tests concluded: " + jqUnit.passCount(data) + " total passed in " + data.runtime + "ms - " + jqUnit.passFail(data.failed));
    }
    jqUnit.log(separator);
    jqUnit.onAllTestsDone.fire(data);
    // Hack to ensure that all output makes it to the calling process
    // See https://github.com/joyent/node/issues/3584
    // This may be removed when we move to node 0.10.x or node 0.12.x at the latest
    process.stdout.write("", function () {
        process.exit(success ? 0 : 1);
    });
};
/**
 * Callback for all done tests in the file.
 * @param {Object} res
 */

// Debounce this to deal with case where QUnit notifies that all tests are done, when in fact
// it has just synchronously executed the first of a set of synchronous tests and another is
// just about to arrive.
// This strategy taken from kof's node-qunit: https://github.com/kof/node-qunit/blob/master/lib/child.js
QUnit.done(fluid.debounce(function (data) {
    jqUnit.allTestsDone(data);
}), 100);

jqUnit.testState = testState;

module.exports = jqUnit;