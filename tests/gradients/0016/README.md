# Remove redundant color-stops in gradient

The first color-stop is at 0% and has the same color as the second color-stop at
50%. This makes the first color stop optional. The remaining color-stops also
share the same color. So there will be no gradient between them, making the
earlier color-stop redundnat and removable as well. The remaining color-stop
is followed by `90%`, and does not need a space separating it from the custom
property.
