# Use single or double quotes in URL's to avoid escapes (single-double)

SVG's can be embedded directly into URL's in CSS. They will always contain
attributes that are wrapped in quotes. However, they may use single or double
quotes. By changing either the wrapping quotes or inner quotes, you can avoid
the need for adding additional escape characters. This assumes the context of
the CSS is in a stylesheet or `<style>` block. If used as part of inline-styles,
escaping will be inevitable.
