# Contributing

Thank you for contributing to `css-minify-tests` -- a correctness test suite
for CSS minifiers.

This project is governed by the [Contributor Covenant Code of Conduct]. By
participating you agree to abide by its terms.

## What this project does

The suite compares minifier output against canonical expected results across
many CSS features. Each test isolates **one** minification technique to make
failures easy to diagnose.

## Test structure

```
tests/
  <category>/
    <NNNN>/
      source.css       # Unminified input (formatted, 2-space indent)
      expected.css     # Canonical minified output (single line + newline)
      README.md        # 2-4 line description of the transformation
      validate.html    # For difficult to reason about tests, this can provide
                       # an test example to run in browsers, showcasing this.
```

## Adding a test

If you'd like to add a test, please consider the following a guide for doing so:

### 1. Pick a transformation

Each test covers ONE transformation. Do not combine multiple optimisations in a
single test. It's likely whitespace will be compressed, but for example try to
avoid combining declarations what will be minified for a test not focusing on
that.

### 2. Verify against the CSS spec

Before writing the test, confirm the minification is **safe** -- the minified
output must be semantically identical to the source. Pay attention to known
unsafe transformations:

- `0%` -> `0` is **sometimes unsafe** (percentage context matters)
- `0s` -> `0` is **unsafe** (unitless zero is invalid for `<time>`)
- `0deg` -> `0` is **often unsafe** (unitless zero is invalid for `<angle>` in
  some contexts)
- `0fr` -> `0` is **unsafe** (unitless zero is invalid for `<flex>`)
- `background: none` -> `background: 0 0` is **unsafe** (different initial values)
- Merging nested `@media` can change cascade behaviour
- Stripping `/*!` comments removes licence text
- Removing quotes from `url()` with special chars breaks parsing
- `calc(100% - 20px)` spaces around `-` are **required**
- Reordering shorthand values can change meaning
- `content: ""` quotes are required

Unsafe tests are also useful! Often minifiers can be overly aggressive and
accidentally make unsafe transforms. Adding tests that confirm CSS _shouldn't_
be minified in certain cases can help highlight this.

### 3. Check for duplicates

Read every existing `source.css` and `expected.css` in the target category. If
an existing test already covers the same transformation, do not add a redundant
test. Only proceed if the new test covers a meaningfully different edge case.

### 4. Determine the test number

List existing directories in `tests/<category>/`. The new test number is the
next sequential 4-digit number (e.g. if `0007` exists, use `0008`).

### 5. Write `source.css`

The unminified CSS. Keep it minimal -- one rule, one transformation, focus on
the value being tested. Use standard formatting (2-space indent, spaces after
colons). Some tips:

- Simple selectors like `a` and `b` keep things short.
- Avoid empty rules -- most minifiers remove them entirely, confounding the
  test.
- If you're not testing declarations a good "filler" declaration is `color:red`,
  which is already compact enough to not be minified any further.

### 6. Write `expected.css`

The shortest correct representation that is semantically identical to the
source. Must be a **single line terminated by a newline**.

### 7. Write `README.md`

Short description (2-4 lines):

```markdown
# Short title

Brief explanation of what transformation is being tested and why it matters or
could go wrong.
```

### 8. Run the tests

```sh
npm test
DEBUG=1 npm run test:debug
```

Interpret results:

- **All pass** -- test is valid and all minifiers handle it. Is this test too
  simple? Is it well covered?
- **Some fail** -- check if the minifier produces a different-but-equivalent
  output (test may be too opinionated) or simply doesn't implement this
  optimisation (that's fine -- the test is still valid). Maybe one minifier
  produces a surprisingly better result, if so it's worth checking how valid
  that result is.
- **All fail** -- verify the transformation against the spec and check that the
  source and expected CSS render identically. If valid but no tool implements it
  yet, keep the test -- congratulations you found a new opportunity for all
  minifiers!

## Adding a minifier

To add a new CSS minifier to the suite:

### 1. Install the package

```sh
npm install --save-dev <package-name>
```

If the minifier needs a peer dependency (like `postcss` for cssnano), install
that too.

### 2. Create an adapter

Add `lib/minifiers/<name>.js`. The file must export a default function that
takes a CSS source string and returns the minified CSS string. The function can
be sync or async.

**Sync example** (like csso):

```js
import { minify as theirMinify } from "some-minifier";

export default function minify(source) {
  return theirMinify(source).css;
}
```

**Async example** (like esbuild):

```js
import { transform } from "some-minifier";

export default async function minify(source) {
  const { code } = await transform(source, { minify: true });
  return code;
}
```

If the minifier is a CLI binary rather than a JS API, see
`lib/minifiers/csskit.js` for an example that calls `execSync` and returns
`null` when the binary is unavailable (shown as N/A in results).

### 3. Register the adapter

In `lib/minify.js`:

1. Import the adapter at the top of the file.
2. Add an entry to the `registry` Map. The key is the npm package name (used
   for version lookups and display).

```js
import myMinifier from "./minifiers/my-minifier.js";

const registry = new Map([
  // ... existing entries ...
  ["my-minifier", myMinifier],
]);
```

### 4. Run the tests

```sh
npm test
```

All existing tests should still run. Your minifier will appear as a new column
in the results table. Failures are expected -- they just mean that minifier
doesn't implement a particular optimisation yet.

### 5. Run `npm run fmt`

Clean up the code by running prettier.

### 6. Open a PR

Include the minifier name, a link to its repository or npm page, and a brief
note on why it's a good addition.

## Code style

No specific linter. Keep things simple and consistent with existing files.

## Submitting

Open a pull request. Describe what transformation the test covers and reference
the relevant CSS spec section if applicable.

[Contributor Covenant Code of Conduct]: https://www.contributor-covenant.org/version/2/1/code_of_conduct/
