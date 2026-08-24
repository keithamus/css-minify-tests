# Remove `.0` decimal from `display-p3`

The `.0` in the number values of a `display-p3` give no additional information
and can be removed. Importantly, `color(display-p3 1 0 0)`, should **not** be
converted to a more narrow gamut like sRGB (`rgb(255, 0, 0)`, `#F00`, `red`,
etc).
