# Remove 0% and 100% from grouped color stops in gradient

You can group the start and stop of a color in a gradient together with a space
separation. However, 0% and 100% are not required because they are implied for
the first and last color in the list. You can also use a unitless `0` to
indicate the first position of a color is the same as the stop of the previous
color.
