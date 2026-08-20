# Shorten the @charset label to its shortest alias

Labels are looked up in the [Encoding Standard], which gives every encoding
several aliases. `iso-8859-1`, `latin1`, `us-ascii`, `ascii`, `cp819` and `l1`
all resolve to the same windows-1252 encoding, so `@charset "ISO-8859-1";`
can be written `@charset "l1";`, saving 8 bytes.

[Encoding Standard]: https://encoding.spec.whatwg.org/#names-and-labels
