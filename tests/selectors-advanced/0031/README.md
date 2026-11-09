# Selectors with escaped special characters

This test has some Tailwind-inspired selectors with escapes in them. A minifier
should not remove the escapes, or misinterpret the special characters and try
to set up nesting.
