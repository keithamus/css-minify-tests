# Convert `quotes: none` equivalents to `none`

All of these are equivalent:

* `quotes: "" "" "" "" "" "";`
* `quotes: '' '' '' '';`
* `quotes: "" "";`
* `quotes:"""";`
* `quotes:none;`

Effectively: "don't use any quotes". A minifier could convert all of these
examples to either `none` or `""""`, as both have the shortest character count.
However, `none` is a commonly used CSS value by many properties, and therefore
has a greater chance at being gzipped. Quotes aren't uncommon, but 4 of them in
a row are, making them a worse candidate for gzipping across a stylesheet.
