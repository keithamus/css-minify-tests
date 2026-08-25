# An unrecognised `@charset` label has no effect

If the label does not match an
[Encoding Standard](https://encoding.spec.whatwg.org/#names-and-labels) label
the lookup fails and the stylesheet keeps the encoding it would have had anyway,
so the rule is inert and removable. Gecko `DetermineNonBOMEncoding` only uses
the label when `Encoding::ForLabel` returns non-null; WebKit/Blink `SetEncoding`
returns early when `!encoding.IsValid()`.
