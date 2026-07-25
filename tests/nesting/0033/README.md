# Do not remove :is when it contains potentially unsupported selectors

If a new CSS feature is used in a selector and the browser does not recognize it
the entire rule will be ignored, even if there are other valid selectors
attached to the rule (`#a:foo,.b{color:red}`). However, if the selectors are
wrapped in an `:is` function then only the unrecognized selector is ignored, the
rest of the selectors still apply the rule (`:is(#a:foo,.b){color:red}`).
