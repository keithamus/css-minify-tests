# Unresolved position-try-fallbacks must be retained

`position-try-fallbacks: --left, --undefined` must keep `--undefined`
even if no matching `@position-try --undefined` exists in the current stylesheet.
Unresolved dashed-ident fallbacks are skipped at runtime and have no effect.
However, it may be defined in other stylesheets ran on the same page, resulting in
an incorrect outcome compared to the unminified code.
