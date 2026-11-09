# Do not naively merge nested `@media` into an outer query list

`screen,print and (width>=768px)` is two queries, so the first would match
narrow screens. A correct merge has to repeat the condition for each query
(`screen and (width>=768px),print and (width>=768px)`), which is longer than
keeping the nesting.
