# Vendor-prefixed duplicate can be dropped when targeting modern browsers

With a modern browserslist target, the `webkit`, `moz`, `ms`, and `o` vendor
prefixes for `transform` are unnecessary because all target browsers support
unprefixed `transform`. The prefix is dead code.
