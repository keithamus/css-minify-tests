# Merging rules is unsafe when strings differ

`content: "i"` and `content: "j"` insert different text, so the rules cannot
share a selector list. A minifier needs to check the actual value and cannot
merge these rules.
