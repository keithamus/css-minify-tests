# Do not merge nested child selectors with different specificity

Comma-separated nested selectors are treated the same as `:is()`, meaning
selectors can only be combined when their specificity level is the same to avoid
changing the authored specificity.
