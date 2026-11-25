# Partial merge across adjacent selectors

The `.a` and `.b` rules both contain a `background-repeat:repeat-x`. In this
case the total combined length of the matching properties and values being
duplicated is longer than if the partially mergable selector (`b`) was
duplicated. So it is shorter to merge `.b` with `.a` on the first rule and
remove the duplicate properties (`background-repeat`). Also, the
`background-image:none` must remain, as it is possible for `.b` to be applied to
an element with another class with a `background-image` that `.b` could
override.
