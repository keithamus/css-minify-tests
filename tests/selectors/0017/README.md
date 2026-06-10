# Multiple spaces in attribute value remain quoted

When an attribute selector's value contains multiple spaces, the quotes
surrounding them must remain in tact to be valid syntax. The spaces should not
be escaped, because it is equal or fewer characters to keep them quoted.
