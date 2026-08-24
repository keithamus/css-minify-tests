# mask shorthand intentionally resets mask-border

Declaring `mask-border` then `mask` resets `mask-border` to its initial value.
The `mask-border` declaration is therefore dead code that can be removed.
