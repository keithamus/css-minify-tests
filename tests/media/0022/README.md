# Do not remove a mixed-unit `@media` range

`em` in a media query is relative to the user's initial font size, not a fixed
`16px`. With the default it is `640px<=width<=600px` and never matches, but a
user font size of `12px` makes it `480px<=width<=600px`. The block must be kept.
