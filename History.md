1.1.9 / 2021-03-31
==================

* Updated to version of Infusion that doesn't produce circular module warning on startup in node 14.x

1.1.8 / 2017-11-17
==================

* FLUID-6225: Upgraded to version of Infusion where self-deduping no longer races uncaught exception handler

1.1.7 / 2017-08-30
==================

* FLUID-6188: Upgraded to version of Infusion where fluid.loadTestingSupport is idempotent
* Removed long-standing process.exit hack required on node 0.10.x since process.stdout.write callback is broken on current versions of electron
