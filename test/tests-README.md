# Testing node-jqUnit
=====================

This directory contains three test suites for verifying node-jqunit. It's best to run them
individually because of the possibility of confusing output.

* `node passingTests.js` - This is a standard test suite for which all tests should pass
* `node failingTests.js` - This is a suite consisting of tests all of which must fail. If 
the run has completed correctly, you will get a final report that reads:

```
jqUnit selfTest OK - all tests failed
```

* `node emptyFixture.js` - This is a suite containing no tests. The correct behaviour for jqUnit is
to report this run as a failure. The output should conclude with

```
Failure in fixture file - no tests were queued - FAIL
```