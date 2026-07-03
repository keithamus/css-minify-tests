# Handle multiple charsets

A `@charset` must be the first part of a CSS or it is ignored. Assume any
declarations of a `@charset` are intentional, and if not at the top of a CSS
file, it is likely a result of concatenating files but it is meant to be used.
Move the first seen `@charset` to the top of the document. Remove all subsequent
`@charset`'s as they are ignored by the browser. If the first seen `@charset`
uses UTF-8, it can be removed too, as it is the default encoding and does not
need to be explicitly defined.
