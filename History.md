1.1.7 / 2017-08-30
==================

* FLUID-6188: Upgraded to version of Infusion where fluid.loadTestingSupport is idempotent
* Removed long-standing process.exit hack required on node 0.10.x since process.stdout.write callback is broken on current versions of electron
