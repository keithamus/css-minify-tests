# Remove Internet Explorer 6 specific properties

Internet Explorer 6 would ignore non-alpha-numeric characters at the start of a
property and still apply the styling. This was non-standard behavior corrected
in Internet Explorer 7. Some web developers exploited this as a hack to apply
IE6 specific styling. Internet Explorer is a long dead browser, and thus these
hacks can safely be removed.

* https://stackoverflow.com/questions/1690642/purpose-of-asterisk-before-a-css-property
