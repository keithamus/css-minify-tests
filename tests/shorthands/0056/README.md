# Fold longhands into `mask` including earlier declarations

`mask` resets `mask-position`, so an earlier declaration must be folded into the
shorthand, rather than resetting the value.
