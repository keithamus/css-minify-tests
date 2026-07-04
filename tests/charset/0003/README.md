# Move @charset to the top of documents

If a `@charset` is used and set to anything besides the default `UTF-8`, it must
be retained and placed at the start of the minified CSS file. If the `@charset`
is not moved to the top of the document, the CSS file will be considered
invalid.

> "It is a specific byte sequence that can only be placed at the very beginning
> of a stylesheet."
\- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@charset
