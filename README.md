# css-minify-tests

A correctness test suite for CSS minifiers.

This project exists in good faith to improve **all** CSS tooling. It is not a
leaderboard and it is not intended to declare winners or call out losers. Every
minifier makes different trade-offs and every score reflects a snapshot in time.
The goal is to give maintainers a shared, vendor-neutral corpus of
transformations they can run against their own tool to find gaps and edge cases.

Inspired by Romain Menke's
[css-tokenizer-tests](https://github.com/romainmenke/css-tokenizer-tests), which
provides a similar community-driven corpus for CSS tokenizers; a project that
helped raise the bar for tokenizer correctness across the ecosystem. The hope
is that this suite can do the same for minification.

## How it works

The suite contains 350 tests organised by category. Each test isolates **one**
minification technique so failures are easy to diagnose:

```
tests/
  <category>/
    <NNNN>/
      source.css       # Unminified input
      expected.css     # Canonical minified output (single line)
      README.md        # Short description of the transformation
      validate.html    # Optional browser-viewable proof of equivalence
```

Categories include at-rules, colors, comments, duplicates, gradients, merging,
selectors, shorthands, transforms, values, whitespace, and zero-units.

Running `npm test` feeds every `source.css` through each minifier, compares the
output to `expected.css`, and prints a summary table. `npm run test:debug` shows
the actual vs expected diff for every mismatch.

## Tested minifiers

- [clean-css](https://www.npmjs.com/package/clean-css)
- [csskit](https://www.npmjs.com/package/csskit)
- [cssnano](https://www.npmjs.com/package/cssnano)
- [csso](https://www.npmjs.com/package/csso)
- [esbuild](https://www.npmjs.com/package/esbuild)
- [lightningcss](https://www.npmjs.com/package/lightningcss)

## Quick start

```sh
npm install
npm test
```

## Adding a minifier

Want to add your minifier to the suite? See the
[contributing guide](CONTRIBUTING.md) for the full walk-through. In short:

1. Create an adapter in `lib/minifiers/<name>.js` that exports a default
   `minify(source)` function returning the minified CSS string.
2. Register it in `lib/minify.js`.
3. Add the npm package to `devDependencies`.
4. Run `npm test` and open a PR.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add tests, verify
transformations against the spec, and interpret results. In short:

1. Run `npm run new-test -- section` where `section` is the name of one of the
   sections (or a new section if you can't find an appropriate existing one).
2. Edit the generated files.
3. Run `npm test` and open a PR.

## License

MIT
