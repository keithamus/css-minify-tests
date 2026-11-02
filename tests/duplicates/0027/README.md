# Remove earlier duplicate property that uses `calc()`

In this example the `width` property is declared 3 times in the same rule.
The final declaration is just a simple pixel value that would be understood by
any browser. Meaning there are no instances where a browser would fall back to
earlier declarations (making them safe to remove). This test also ensures that
usage of `calc` does not recieve special treatment in this scenario, it should
also be removed.
