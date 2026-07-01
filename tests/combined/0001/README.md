# Merge rules after property and selector optimizations

This test validates correct order of operations in a minifier. If the merging or
de-duplication of rules occurs prior to selector and/or property optimizations,
then it will miss out on opportunities for merging identical rules that are only
revealed after they've had those optimizations.

1. All property optimizations should be done
   * Colors converted to smallest representations
   * Border shorthand applied
   * etc.
1. Selectors on individual rules are optimized
   * `:where(td):where(.error)` => `:where(td.error)`
   * `:is(span, div)` => `span,div`
   * etc.
1. Merging/deduping of rules is applied
   * `div,span,:where(td.error),span,div` => `div,span,:where(td.error)`

Before attempting to pass this test, first pass the tests it combines:

* `colors/0002` - `#FF0000` -> `red`
* `combined/0002` - `hsl(0 100 50)` -> `red`
* `combined/0002` - `rgba(255 0 0 / 1)` -> `red`
* `duplicates/0007` - `a{color:red}a{color:red}` -> `a{color:red}`
* `selectors-advanced/0001` - `:is(a,b)` -> `a,b`
* `selectors-advanced/0018` - `:where(.foo):where([bar])` -> `:where(.foo[bar])`
* `shorthands/0041` - (`border-color` + `border-style` + `border-width` = `border`)
