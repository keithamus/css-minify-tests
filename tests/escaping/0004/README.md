# Hex escape for hyphen-minus in element name

`my\2d component` encodes a hyphen-minus, producing `my-component`. The hyphen
is a valid mid-identifier so the escape can be resolved to a literal `-`.

**See also:** escaping/0015
