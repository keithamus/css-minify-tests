# Don't hoist short vendor-prefix fallback value into a custom property

`mask-image` and `-webkit-mask-image` share an identical, short `url()`
value. Unlike [0001](../0001), which hoists a long, duplicated data URI into a
custom property to save bytes, here the value is already short, so
introducing `--mask-image` and two `var()` references would make the output
longer, not shorter. The declarations should be left duplicated as-is.
