# Only nest children when necessary

A wrapper that only holds one nested rule and no declarations should be written
as a descendant selector, because `.x{.y{...}}` is longer than `.x .y{...}`.
