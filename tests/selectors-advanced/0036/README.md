# Attribute case sensitivity in selectors

The `i` and `s` specify case insensitive matching on the attribute value, or
case sensitivity. Since the value does not contain a space, quotes are optional.
Some HTML attributes are case sensitive, like `class`, `id`, `title`, etc. For
these attributes, the `s` is implied and can be removed. However, some HTML
attributes are case insensitive, like `accept`, `charset`, `lang`, `rel`, etc.
For these attributes the `i` is implied and therfore not needed. For a full list
of case-insensitive attributes, consult the HTML spec:

* https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
