# Merge identical adjacent rules after color minification

After other optimizations are complete, like minifying color representations,
merge any identical adjacent rules.

Combines:

* Several of the `colors/*` tests that convert colors to shorter representations  
* `colors/0067` - `light-dark` test
* `duplicates/0007` - `a{color:red}a{color:red}` -> `a{color: red}`
