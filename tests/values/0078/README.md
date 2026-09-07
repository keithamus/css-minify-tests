# Retain escape slash in quote-less URLs

If a URL contains only one space, its quotes can be removed and the space can
be escaped, resulting in fewer characters. If this optimization has already
been performed, the escaped space should be retained.
