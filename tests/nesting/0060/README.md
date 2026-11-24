# Remove overridden rule, then nest and regroup partially matching children

In this complex CSS, the third rule is immediately overridden by the 4th making
it safely removable. The first two selectors can be nested under `.a.b`. Once
nested `:hover` and `:active` share a matching property/value pair. It is
shorter to repeat `:active` than to repeat `background:red`. So the two can be
partially merged with a separate `:active` left behind to just handle the
`color:tan`. The originally removed `.a:hover{color:tan}` should not influence
the nesting at all.
