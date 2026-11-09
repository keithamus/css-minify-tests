# Remove nested `@media` with mutually exclusive media types

A document has one media type at a time, so `print` nested inside `screen` can
never match. The whole block is dead and can be removed.
