# Discard invalid selectors using double pipes

A pipe in a selector can be used for namespacing. However, two pipes are invalid
syntax and will cause the entire rule to be ignored by the browser. If the two
rules in this example are merged, then both will be ignored by the browser
(unless wrapped in `:is()`). Since the double pipes rule will be ignored, it is
safe to remove it during minification. The `url()` wrapper in the `@namespace`
can be removed as well, if the quotation marks around the URL are retained. A
space is not required between the name and quoated URL.

**References:**

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@namespace
* https://www.w3.org/TR/selectors-3/#typenmsp
