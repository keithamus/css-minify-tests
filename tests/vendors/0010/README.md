# Remove IE6 rule before nesting

A property starting with `*` was commonly used as a vendor-specific hack for
Internet Explorer 6. These properties can safely be removed. In this test, after
removing it, the first rule will be empty and can therefor be removed. If a
minifier attempts nesting before this removal, it will result in a longer
`a{&:hover{color:red}}`.
