# Resolve simple percent division in `calc`

Replace a calculation with the result when it is a percentage divided by a
number that results in a non-repeating positive interger that is shorter
than the minified version of the calculation.

**Example:**

* `calc(100%/16)` is 13 characters
* `6.25%` is 5 characters
