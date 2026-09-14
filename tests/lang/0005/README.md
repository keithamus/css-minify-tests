# Add quotes to `:lang()` when shorter than escaping

Language-codes used by `:lang()` can contain an asterisk as wild card character.
Because this character also has semantic significance in CSS, it must either be
quoted, or escaped. In cases where you are escaping more than twice, it is
shorter to wrap the language-code in quotes.
