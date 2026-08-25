# Preserve animation timeline and range resets

The animation shorthand resets animation-timeline and animation-range to their
initial values despite not explicitly expressing them. When merging animation
longhands into shorthand form, the shorthand must be ordered before any
animation-timeline or animation-range declarations to preserve the resets.
