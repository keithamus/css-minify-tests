# A UTF-16 @charset label means UTF-8

[Determining the fallback encoding] says that if the `@charset` label resolves
to `utf-16be` or `utf-16le`, the encoding used is `utf-8`. The declaration bytes
are ASCII, so the file cannot really be UTF-16. `@charset "utf-16be";` therefore
means `@charset "utf-8";`, which is the default and can be dropped (see
charset/0001).

[Determining the fallback encoding]: https://drafts.csswg.org/css-syntax-3/#determine-the-fallback-encoding
