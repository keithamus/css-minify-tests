# Never resolve escapes inside a @charset label

Engines read `@charset` rules as raw bytes, not CSS strings, therefore escaping
isn't taken into account. Everything between `@charset "` and `";` is the label.
The literal bytes of `\67 bk` might resolve in CSS syntax as "gbk" - a valid
encoding label, but the pre-escaped label not an Encoding Standard label, so
the rule is inert and removable.

A minifier that unescapes strings would emit `@charset "gbk";` and change how
the browser decodes the whole file. This is incorrect.
