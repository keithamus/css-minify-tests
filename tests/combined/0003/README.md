# Introduce nesting to repeated selectors and deduplicate overridden properties

Nest adjacent rules where the selectors all start with the same prefix. Then, if
any selectors are used in multiple nested rules with the same properties, remove
the earlier defined property. If this results in any empty rules, remove those
as well.

Combines:

* `duplicates/0020` - `h1,h2{color:#001}h1{color:#002}h2{color:#003}` -> `h1{color:#002}h2{color:#003}`
* `empty-rules/0004` - `a{color:red;b{}}` -> `a{color:red}`
* `nesting/0020` - `.foo .a{color:red}.foo .b{color:tan}` -> `.foo{.a{color:red}.b{color:tan}}`
