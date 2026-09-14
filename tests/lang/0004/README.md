# Remove quotes from `:lang()` while escaping wildcard

Language-codes used by `:lang()` can contain an asterisk as wild card character.
Because this character also has semantic significance in CSS, it must either be
quoted, or escaped. In this case, escaping requires fewer characters.
