# Merge rule with rule that is nested and includes nested-parent selector (`&`)

In this test there are two rules that share a common start to their selectors,
(`.a .c`). There is another rule separating them that can safely be moved above
or below the others as it's specificity is lower (`.b`). The merging and nesting
of the similar rules will require using a nested `&` to apply the
`background:inherit;` to the `.a .c` as well.
