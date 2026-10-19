# Discard invalid selectors using doub

A pipe in a selector can be used for namespacing. However, two pipes are invalid
syntax and will cause the entire rule to be ignored by the browser. If the two
rules in this example are merged, then both will be ignored by the browser
(unless wrapped in `:is()`). Since the double pipes rule will be ignored, it is
safe to remove it during minification.

**References:**

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@namespace
* https://www.w3.org/TR/selectors-3/#typenmsp
