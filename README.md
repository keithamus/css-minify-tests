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

The suite contains hundreds of tests organised by category. Each test isolates
**one** minification technique so failures are easy to diagnose:

```sh
tests/
  <category>/
    <NNNN>/
      source.css       # Unminified input
      expected.css     # Canonical minified output (single line)
      README.md        # Short description of the transformation
      validate.html    # Optional browser-viewable proof of equivalence
```

Categories include at-rules, colors, comments, duplicates, gradients, merging,
nesting, selectors, shorthands, transforms, values, vendors, whitespace,
zero-units, and more.

Running `npm t` feeds every `source.css` through each minifier, compares the
output to `expected.css`, and prints a summary table.


## Tested minifiers

* [clean-css](https://www.npmjs.com/package/clean-css)
* [csskit](https://www.npmjs.com/package/csskit)
* [CSSLOP](https://www.npmjs.com/package/@thejaredwilcurt/csslop)
* [cssnano](https://www.npmjs.com/package/cssnano)
* [csso](https://www.npmjs.com/package/csso)
* [esbuild](https://www.npmjs.com/package/esbuild)
* [lightningcss](https://www.npmjs.com/package/lightningcss)
* [sass](https://www.npmjs.com/package/sass)

[See results](https://www.keithcirkel.co.uk/css-minify-tests)


## Running locally

1. You'll need to be on the correct Node an npm versions defined in the
   `package.json`. Use a tool like Proto or Mise to handle switching
   your versions automatically.
1. Run `npm i` to install dependencies
1. Run `npm t` to execute the test suite


## Adding a minifier

Want to add your minifier to the suite? See the
[contributing guide](CONTRIBUTING.md) for the full walk-through. In short:

1. Create an adapter in `lib/minifiers/<name>.js` that exports a default
   `minify(source)` function returning the minified CSS string.
1. Register it in `lib/loaders/loadAllMinifiers.js`.
1. Add the npm package to `devDependencies`.
1. Run `npm test` and open a PR.
1. Update the README to add it to the list of "Tested minifiers"


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add tests, verify
transformations against the spec, and interpret results. In short:

1. Run `npm run new-test section` where `section` is the name of one of the
   section (or a new section if you can't find an appropriate existing one).
1. Edit the generated files.
1. Run `npm test` and open a PR.


## License

MIT
