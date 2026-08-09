# Retain `:is` after de-duping selectors if not all selectors are browser-safe

Repeated selectors in a `:is()` can be removed. If a selector is not recognized
as being browser-safe the `:is()` must not be removed, as all selectors for the
rule would then be ignored by the browser.
