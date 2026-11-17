# Remove color properties set to invalid colors

The 5 digit hex value `#00f00` is invalid, so the browser will ignore the
property it is assigned to. The browser will then fallback to the color
`fizzbuzz` which is not a valid color keyword, so that property is also ignored
by the browser. It then fallsback to `red` which is valid. The ignored
properties are therefore safe to remove.
