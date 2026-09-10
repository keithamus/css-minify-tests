# Remove current directory indicator from start of URL

If a file path in a URL (for a background, mask, etc) begins with a period and a
forward-slash (`./`), they can be removed. They indicate that the file path
starts from the same directory as the CSS file. However, when removed, the
browser will assume this automatically.
