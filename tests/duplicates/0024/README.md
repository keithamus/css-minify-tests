# Remove duplicate property in rule when one uses custom-properties

Browsers ignore earlier declared property/value pair declarations when the same
property is used in the same rule, unless the later version contains a value it
does not recognize. Then it falls back to the most recent previous version of
that property with a value it can use. All browsers support custom-properties so
in this test, none of them will fall back to the primitive value version. Even
if the custom property was never defined the browser will still prefer it over
the fallback. This means these fallbacks will never be used and are redundant.
