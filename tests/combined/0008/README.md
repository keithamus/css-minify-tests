# Nest adjacent rules separated by a comment with child combinator

In this example, a minifier should remove the comment. Then nest the two
adjacent rules that share common ancestors in their selectors. These rules
should nest with the direct descendant (child combinator `>`). The first rule
looks unnecessarily nested. A minifier may try to un-nest it, rather than nest
it with the following rule, which would result in a longer output.
