# Convert Base 64 encoded SVG's to UTF-8

An SVG can be embedded in a data-URI, and encoded as either `base64` or `utf8`.
However, both in character length, and gzip compression, the `utf8` version is
preferred for minification. In JavaScript the encoded value can be passed into
the native `atob` function to decode `base64` to `utf8`.
