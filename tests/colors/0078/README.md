# Do not convert `outline:transparent` to `outline:none`

A transparent outline does not display anything on the screen in most
situations, making it equivalent to setting the outline to `none`. Though this
is fewer characters it may break accessibility. Users with their OS in "High
Contrast" mode will actually see an outline when it is set to `transparent`,
but will not when it is set to `none`. You can however convert `transparent`
to `#0000`, which is functionally equivalent according to the CSS spec.

* https://www.youtube.com/shorts/4B_4WLpbyp8
* https://www.w3.org/TR/css-color-3/#transparent
