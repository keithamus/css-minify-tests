# Remove usesless `:is()`, but retain useful `:is()`

When any part of a selector is not recognized by the browser, the entire rule
gets ignored, unless the unrecognized portion is wrapped by a `:is()` function.
Selectors that are clearly recognizable by the browser (class, id, :hover, etc)
that are wrapped by an `:is()` without any other selectors can be unwrapped.
However, if a browser could potentially not recognize a selector wrapped in an
`:is()`, and there is a comma separated list of other selectors that would be
effected by the rule being ignored if the `:is` was removed, then the wrapper
must be retained to protect the rule.
