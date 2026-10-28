# An+B numbers must not use scientific notation

The An+B microsyntax only accepts integers, so `1000n+1000000` cannot be
written as `1e3n+1e6`. `1e3n` is a dimension with a non-integer type and
invalidates the selector.
