# Merge identical adjacent rules after color minification

After other optimizations are complete, like minifying color representations,
merge any identical adjacent rules.

**Combines:**

* `colors/0002` - `#FF0000`
* `colors/0003` - `rgb(255, 0, 0)`
* `colors/0008` - `hsl(0, 100%, 50%)`
* `colors/0016` - `rgb(255 0 0 / 1)`
* `colors/0010` - `hwb(0 0% 0%)`
* `colors/0021` - `rgb(255 none none)`
* `colors/0023` - `red`
* `colors/0024` - `color-mix(in srgb, rgb(none 0 0) 50%, rgb(255 0 0) 50%)`
* `colors/0028` - `color-mix(in srgb, red, red)`
* `colors/0036` - `color-mix(in srgb, red 100%, blue)`
* `colors/0037` - `color-mix(in srgb, blue 0%, red)`
* `colors/0041` - `color-mix(in srgb, red, blue 0%)`
* `colors/0067` - `light-dark(red, red)`
* `colors/0070` - `lab(54.291% 64.644% 55.913%)`
* `colors/0071` - `lab(54.291 80.805 69.8913)`
* `colors/0073` - `#F00`
* `colors/0074` - `#FF0000FF`
* `colors/0075` - `hsl(0 100 50)`
* `colors/0076` - `rgba(255, 0, 0, 1)`
* `colors/0077` - `hwb(0 0 0)`
* `comments/0001` - `a{color:red}/* comment */` -> `a{color:red}`
* `duplicates/0007` - `a{color:red}a{color:red}` -> `a{color:red}`
* `whitespace/0001` - `a {\n  color: red;\n}` -> `a{color:red}`
