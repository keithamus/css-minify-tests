# @supports -- space around `and` combinator required

`@supports (X) and (Y)` requires spaces around `and`. Without a space after
`and`, the tokenizer produces a function token `and(` instead of the keyword
`and` followed by `(`, causing the entire @supports rule to be dropped by the
parser.
