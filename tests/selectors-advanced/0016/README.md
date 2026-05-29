## Retaining correct specificity in `:is`

In 0011 (`:is(:link, :visited)` to `:any-link`), we can safely remove the `:is`
because there are no other selectors inside it. But in this test, we must keep
the `:any-link` inside the `:is`, because `:is` adopts the specificity of the
most specific selector inside it.

```css
/* :is has specificity of 010 */
:is(:link,:visited,:where(h1)){color:red}

/* :is has specificity of 000 */
:any-link,:is(:where(h1)){color:red}

/* :is has specificity of 010 */
:is(:any-link,:where(h1)){color:red}
```

The changing in specificity may effect the pixels painted to the screen. This
test ensures correctness in the minification.
