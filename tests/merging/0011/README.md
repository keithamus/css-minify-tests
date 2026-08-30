# Merging rules is unsafe when custom idents differ

`animation-name: pulse` and `animation-name: shake` name different keyframes, so
the rules cannot share a selector list. Minifiers need to check the actual value
to ensure they don't merge different values.
