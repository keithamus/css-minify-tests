# Remove triple 100% from end of gradient

If a gradient's color stop ends with 100%, and is followed by another color of
100% start and 100% end, both can be removed, as the 100% will be implied.
Even though the prior color stop ends with the same percent as the start of the
next color, since the start is 100% it can be removed, instead of replaced with
unitless `0`.
