# Combine nested selectors with same specificity using `:is` when you can't nest

In this example, because we also want the wrapping element (`.foo`) to receive
the same styles as it's children, we can't simple nest them. However, since all
the children have the same level of specificity, we can wrap them in an `:is()`
to reduce the repetition of `.foo`.
