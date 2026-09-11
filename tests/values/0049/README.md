# url() quotes required when URL contains 2 or more parentheses

Removing quotes from `url("image (1).png")` would produce `url(image (1).png)`
which is a parse error -- the unquoted form cannot contain `(` or `)`. You could
escape these characters to avoid a syntax error: `url(image\ \(1\).png)`,
however, that removes two characters (quotes) and adds in 3 (slashes), in this
case. If there is only one opening or one closing parenthesis, then escaping
would be shorter.
