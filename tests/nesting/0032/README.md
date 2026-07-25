# Remove useless `:is` from selector nesting

Comma-separated selectors in rules with nesting are treated as though the
selectors are wrapped in an `:is`, resulting in shared specificity, using the
more specific of all the selectors. In this test, the `:is()` contains an ID
and a class, with another class outside of it, which will recieve whatever the
result of the :is() evaluation anyways, making it pointless to include.

The `#a,.b,.c` in the test is equivalent to `:is(#a,.b.c)`, which is equivalent
to `:is(:is(#a,.b),.c)`.
