# Remove `@property` that only contains a comment

From [the spec](https://drafts.css-houdini.org/css-properties-values-api/#at-ruledef-property):

> `@property` rules require a `syntax` and `inherits` descriptor. If either are
missing, the entire rule is invalid and must be ignored. The `initial-value`
descriptor is optional only if the syntax is the `universal syntax definition`
(`"*"`), otherwise the descriptor is required; if it is missing, the entire rule
is invalid and must be ignored.
