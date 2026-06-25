# :where() merge with type selector reordering

`:where(:hover):where(a)` merges to `:where(a:hover)`, not `:where(:hover a)`. A
type selector must come first in a compound selector. Naive string concatenation
might produce `:where(:hover a)` which is a complex selector (descendant
combinator) with different semantics.
