# Non-adjacent `@media` merge is unsafe due to cascade

Although there are two `@media` blocks with identical conditions, the rule that
separates them applies styles to the same properties on the same elements.
Repositioning the `@media` blocks to merge them would break the cascade. Instead
the second media query can be nested under the rule, which is shorter, but still
preserves the orignal cascade.
