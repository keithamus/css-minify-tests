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
   * `:is(span, div)` => `span, div`
   * etc.
1. Merging/deduping of rules is applied
   * `div,span,:where(td.error),span,div` => `div,span,:where(td.error)`
