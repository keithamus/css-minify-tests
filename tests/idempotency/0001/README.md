# Test idempotency

Given a test input like this: `a{color:rebeccapurple;}`, a minifier may produce
an output like this `a{color:#663399}`. If we then run that output through the
minfier and it produces a different value, like `a{color:#639}`, then it has
failed at idempotency for that test.

A minifier is considered idempotent if the minified output could be minifed
itself and no changes occur. This test takes the minified output of every test
in the `css-minify-tests` Test Suite, and checks if they change when being
minifed.

If a minifier fails idempotency for any test, the name of the test will be
listed in the Outputs below.
