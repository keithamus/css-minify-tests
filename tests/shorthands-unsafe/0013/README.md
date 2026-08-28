# A shorthand must not swallow an earlier sibling longhand

`mask-image` and `mask-repeat` fold into `mask`, but `mask` also sets
`mask-position`. The shorthand will reset earlier `mask-position` values,
therefore folding is only safe if the earlier declaration is re-ordered to be
after the shorthand.
