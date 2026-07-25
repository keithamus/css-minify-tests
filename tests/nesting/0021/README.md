# Merge nested children with the same rules and specificity

Comma-separated nested selectors are treated the same as `:is()`, meaning they
can only be combined when their specificity level is the same.
