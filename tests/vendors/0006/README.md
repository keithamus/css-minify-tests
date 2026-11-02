# Remove common gradient vendor prefixes

Since the `background-image` property is reassign multiple times, the final
declaration will be used, unless it is unsupported by the browser, then it will
fall back to one of the prior declarations. All modern browsers support
`linear-gradient`, making the earlier vendor-specific declarations redundant.
