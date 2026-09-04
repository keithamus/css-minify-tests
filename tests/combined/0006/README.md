# Remove useless `:is()` and useless nesting

If there is no value in nesting selectors, un-nest them. If there is no value
in wrapping a selector with `:is()`, unwrap it.

Combines:

* `nesting/0013` - Unnest empty parent - `a{b{color:red}}` =>`a b{color:red}`
* `selectors/0018` - Remove usesless `:is()` - `:is(.x)` => `.x`
