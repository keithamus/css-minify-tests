# Do not convert reciprocal multiplication to division when right value has unit

In `calc/0026` we convert reciprocal multiplication to division (`x * .25` =>
`x / 4`), however this should only be done when the right-side value is
unitless. The CSS spec requires the right-side value to have its unit inverted
to a negative during division.

For example, assuming `--x: 1;`:

* `var(--x) * 0.25s` becomes
* `(1,{}) * (0.25, {s: 1})` becomes
* `(0.25, {s: 1})` becomes
* `0.25s`

However,

* `var(--x) / 4s` becomes
* `(1,{}) * (0.25, {s: -1})` becomes
* `(0.25, {s: -1})` becomes
* `-0.25s`

Which is not equivalent to the original authored intent, making it incorrect,
and in many cases also invalid according to the browser.

**References:**

* https://drafts.csswg.org/css-values-4/#simplify-a-calculation-tree
* https://drafts.csswg.org/css-values-4/#determine-the-type-of-a-calculation
* https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-invert-a-type
* https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types
