# Convert background-position to percent when possible

The `top`, `bottom`, `left`, `right`, and `center` keywords can be represented
as percents and always yield a shorter outcome. However, when combined with
non-percent values, or when used with 3 or 4 arguments, the extra numerical
inputs count as offsets, and require the keywords to be retained. When just
providing the Y-axis (`bottom`) without the X-axis (`left`), retain the keyword.
