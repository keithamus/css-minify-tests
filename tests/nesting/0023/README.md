# Merge nested children with the same rules and specificity (IDs)

Comma-separated nested selectors are treated the same as `:is()`, meaning they
can only be combined when their specificity level is the same.

In this test, an unnested equivalent would look like
`a :is(#b.c),a :is(.d.e,#f.g){color:red}`. Notice how the `:is()` produces a
specifity of `1-1-0` in both cases, allowing them to be merged to
`.a :is(#b.c,.d.e,#f.g){color:red}`, which when re-nested is shorter
`.a{#b.c,.d.e,#f.g{color:red}}`.
