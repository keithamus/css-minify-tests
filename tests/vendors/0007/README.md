# Remove `display: flex` fallbacks

In this example there are fallbacks, including a vendor-specific one, for
`display: flex`. All modern browsers now support flexbox, meaning browsers will
ignore the earlier `display` property declarations and just use the most recent
declaration. The earlier declarations can safely be removed.
