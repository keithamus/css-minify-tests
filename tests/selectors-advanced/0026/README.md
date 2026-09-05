# Remove selector from list in rule when it is fully overridden later

If a selector is in a group of selectors on a rule, and all properties in that
rule are overridden for that selector later, it is safe to remove it from the
earlier list.
