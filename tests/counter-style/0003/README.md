# Quoted symbols must preserve quotes

`symbols: "(" ")"` must keep quotes. Parentheses are not valid unquoted ident
tokens and stripping quotes would produce a parse error.
