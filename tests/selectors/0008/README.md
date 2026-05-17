# :nth-child(1n) shorthand

`:nth-child(1n)` (equivalently `:nth-child(n)`) matches every child element. The pseudo-class could be removed entirely, going from `a:nth-child(1n)` to `a`, however, that would change the level of specificity for the selector, which could result in different styles being applied. For correctness, `:nth-child(1n)` should become `:nth-child(n)`, because it is shorter, but retains the same specificity.
