# Combine adjacent identical colors in linear-gradient and remove 0%/100%

If the same color has multiple adjacent color stops, the color stops can be
combined, retaining only the first and last percent and separating them with a
space. If the first percent is 0% or the last percent is 100% they can be
removed as these are automatically implied. If the first percent is the same as
the last percent of the previous color stop, it can become a unitless `0`.
