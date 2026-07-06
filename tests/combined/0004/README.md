# Linear gradient optimizations and background property shorthand

Convert all colors to their minified representation first, then apply advanced
linear-gradient optimizations and combine all background properties to use the
background property shorthand.

Combines:

* `colors/0001` - Short hex
  * `#ffffff` -> `#fff`
* `colors/0002` - Hex to color keyword
  * `#ff0000` -> `red`
* `colors/0003` - RGB to color keyword
  * `rgb(255, 0, 0)` -> `red`
* `colors/0008` - HSL to color keyword
  * `hsl(0, 100%, 50%)` -> `red`
* `colors/0011` - Color keyword to hex
  * `blue` -> `#00f`
* `gradients/0001` - Remove `to bottom`.
  * `linear-gradient(to bottom, red, tan)` -> `linear-gradient(red,tan)`
* `gradients/0006` - Combine colors in gradient and remove 0%/100%
  * `linear-gradient(red 0%,red 50%,tan 50%,tan 100%)` -> `linear-gradient(red 50%,tan 0)`
* `shorthands/0076` - Background properties shorthand
* `values/0072` - keyword to percent
  * `background-position:right bottom;` -> `background-position:100% 100%;`
