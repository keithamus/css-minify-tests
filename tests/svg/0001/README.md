# Use single or double quotes in URL's based on amount of escapes

SVG's can be embedded directly into URL's in CSS. They will always contain
attributes that are wrapped in quotes. However, they may use single or double
quotes. By changing the wrapping quotes, you can avoid the need for adding
additional escape characters. This assumes the context of the CSS is in a
stylesheet. If used as part of inline-styles, escaping will be inevitable.
