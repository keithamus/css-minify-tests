# Keep `color-mix()` with three colours in `@supports`

Resolving the `color-mix()` to `#555` makes the condition true everywhere, so
browsers which don't support the color-mix would apply the rule. Values inside
`@supports` conditions must not be reduced past what the browser is being asked
to support.
