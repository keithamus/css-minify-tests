# Remove `:is` after de-duping selectors

Repeated selectors in a `:is()` can be removed. If all selectors have the same
level of specificity, and are known to be browser-safe, the `:is()` can
be removed too.
