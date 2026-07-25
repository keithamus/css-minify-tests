# Remove useless calc's in hsl(from)

The calculations used here can all be resolved and simplified during runtime.

* `a{color:hsl(from rebeccapurple calc(h)calc(s*1)calc(l + 0)/calc(1 / 1))}`
* `a{color:hsl(from rebeccapurple calc(h)calc(s*1)calc(l + 0)/1)}`
* `a{color:hsl(from rebeccapurple calc(h)calc(s*1)l/1)}`
* `a{color:hsl(from rebeccapurple calc(h)s l/1)}`
* `a{color:hsl(from rebeccapurple h s l/1)}`
* `a{color:rebeccapurple}`
* `a{color:#639}`
