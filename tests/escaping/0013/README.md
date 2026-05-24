# Escaping HREF attribute values

Attribute selectors can include values in optional quotes. Since HREF
specifically deals with URL paths, they will naturally contain characters that
need escaped if not wrapped in quotes (`#`, `.`, `:`, etc). A minifier should
remove the quotes and favor escaping if the total characters in the escaped
version is fewer than if it was kept in quotes. It should remove escapes and
prefer quotes when that has fewer characters.
