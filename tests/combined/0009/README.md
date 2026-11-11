# Remove useles rule after unwrapping `:is()`

In this test the `:is` contains a single selector of a known-safe value. It is
therefore equivalent to unwrap the `:is`. The remaining rule is followed by a
rule targeting the a matching selector with all of the same properties, making
the first rule redundant and safe to remove.

Combines:

* `duplicates/0002` - Duplicate rule removal - `a{x:y}a{x:z}` => `a{x:z}`
* `selectors/0018` - Remove usesless `:is()` - `:is(.x)` => `.x`
