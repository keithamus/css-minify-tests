# Do not naively merge nested `@media` with a query list

`screen and (hover:hover),(pointer:fine)` is two queries, the second of which
also matches `print`. The correct merge, `screen and ((hover:hover)or
(pointer:fine))`, is one byte longer than keeping the nesting.
