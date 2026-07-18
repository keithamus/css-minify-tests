# Remove triple 0% from start of gradient

If the first color in a gradient has a color start and stop of 0%, both can be
removed. If the following color starts with the same percent as the stop of the
previous color, it can be renamed to a unitless `0`.
