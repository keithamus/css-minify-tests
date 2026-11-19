# Merge attribute selectors after eliding case sensitivity indicators

In this test, we verify that after removing a useless `i` or `s` from an
attribute selector, normal merging and de-duplicating is applied.

Combines:

* `duplicates/0002` - Duplicate rule removal
  * `a{x:z}a{x:y}` => `a{x:y}`
* `merging/0002` - Merge adjacent rules with same declarations
  * `a{x:y}b{x:y}` => `a,b{x:y}`
* `selectors-advanced\0036` - Attribute case sensitivity in selectors
  * `[title=a s]{a:b}[accept=a i]{c:d}` => `[title=a]{a:b}[accept=a]{c:d}`
