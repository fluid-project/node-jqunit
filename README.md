# `node-jqunit` - A JavaScript Unit Testing framework

The XUnit testing style (first seen in JUnit and the like) is a popular style
for writing test fixtures. `node-jqunit` is a port of this idiom to JavaScript for use
within the node.js server-side JavaScript framework. It uses Fluid's [infusion](https://github.com/fluid-project/infusion) framework
for resolution of global names. Currently the majority of the implementation of jqUnit itself is also within the `infusion` module.
This implementation itself is layered on top of the popular [QUnit](https://qunitjs.com/) framework.

We traditionally name `node-jqunit`'s global as `jqUnit` (which is not a valid npm module name as it contains a capital letter). 

## Running a test fixture file

To run a file containing test fixtures, simply execute it with node - 
```
node fixtureFile.js
```

## Writing a test fixture file 
To write a fixture file, begin with
```
var fluid = require("infusion");
var jqUnit = fluid.require("node-jqunit", require, "jqUnit");
```

You may use also use plain "require" to load jqUnit, although it is essential that it itself may resolve the Fluid framework (infusion).

Then begin by starting a "module" and then issue some tests:
```
jqUnit.module("My Module");

jqUnit.test("My test case", function () {
    jqUnit.assertTrue("I assert that this is true", true);
    }
);
```

## Writing jqUnit tests

The documentation for jqUnit itself is in Infusion's documentation at [jqUnit](http://docs.fluidproject.org/infusion/development/jqUnit.html).
All the assertions and helper functions described there are valid for use within `node-jqunit` if they do not refer to the browser or DOM nodes.

## Running self-tests

The test cases for `node-jqunit` itself can be found in the [test](test) directory - instructions for running them are in their [README](test/tests-README.md) 