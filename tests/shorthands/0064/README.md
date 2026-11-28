# `flex` shorthand with grow/shrink of `1` and a basis value

A flex with a physical basis value (`600px`, `10em`, `12rem`, `3in`, `12cm`,
`50%`, `auto`, etc) assumes a `flex-grow` and `flex-shrink` of `1`, so they do
not need to be defined. `flex:1 1 400px` is the same as `flex:400px`.

* https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex
