# Merging and nesting after a media query and conflicting rule

There is an `.a` rule at the start and end of this snippet that can be merged.
The later `.a` shares a property with `.c` (`margin`) which has the same
specificty. This means the later `.a` rule cannot be moved above it. However, it
is safe to move the earlier `.a` rule down to be merged with the later version.
The remaining `.b`, `.b:hover`, and media query can all be nested together.
