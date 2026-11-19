# Nesting non-adjacent compound selector rules

In this example, there are 3 rules that share a parent (compound) selector, and
an unrelated rule separating them. The unrelated rule (`.x`) has a property that
overlaps withthe rules before and after it, however they all have a high
specificity, making it safe to move this unrelated rule above or below the rest.
The remaining rules can be merged and nested.
