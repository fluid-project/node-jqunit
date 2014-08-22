// A file which queues no tests - this should not report a test run success

var fluid = require("infusion");
var jqUnit = fluid.require("../lib/jqUnit-node.js", require);

jqUnit.module("Empty Fixture Module");
