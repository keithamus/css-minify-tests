# Dedupe after flattening unnecessary nesting

In this example, there is a nested rule with only `&` as the selector, making
properties held within apply to the parent selector. This means those properties
can be unnested. In this case that results with the same property applied twice,
the later property overrides the previous as part of the cascade, making the
previous safe to remove (unless the value assigned to the later version has
weak browser support).

Relates to `nesting/0040`.
