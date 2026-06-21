# Use ranges for adjacent unicode-range values

If there are multiple adjacent (off by 1) unicode values in a unicode range,
the first and last item in a group can be combined in a range
(`U+2000,U+2001,U+2002` becomes `U+2000-2002`).
