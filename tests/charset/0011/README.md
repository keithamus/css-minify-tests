# An uppercased @charset is not an encoding declaration

CSS at-keywords are ASCII case-insensitive, but the @charset rule, and its value
are not: engines compare raw bytes against `@charset "`. So `@CHARSET "gbk";`
declares nothing and the parser drops the at-rule; it can be removed.
