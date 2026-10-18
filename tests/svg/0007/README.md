# Use shorter color representations in SVGS in URLs

Colors used inside data-URI embedded SVGs should be minifed. However, there are
caveats unique to this scenario. A pound sign must be URL-encoded for use in
hex values (`#f00` -> `%23f00`). Because of this increase, some hex values, like
`#0F0` are actually shorter when written out as their color keywords (`lime`
vs `%230F0`), but other keywords are still shorter when converted to URL-encoded
hex (`lightgoldenrodyellow` -> `%23fafad2`). Other color representations should
be converted to URL-encoded hex or color keyword if in the sRGB color gamut.
