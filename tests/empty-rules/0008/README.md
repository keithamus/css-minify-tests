# Remove parent selector when all nested selectors are empty

This verifies that stray empty selectors are not left behind after empty child
selectors are removed. If minified correctly, the result will be 0 bytes.
