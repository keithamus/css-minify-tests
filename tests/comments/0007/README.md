# Remove comments from custom-property values

If a custom-property is assigned to only a CSS comment, the entire comment can
safely be removed. However, the custom-property declaration must remain. If a
custom-property contains values with a comment between them, then the comment
token must remain, though it's contents can be removed.
