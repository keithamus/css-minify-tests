# :where() with conflicting type selectors - no merge

`:where(div):where(span)` cannot be merged: a compound selector cannot contain
two type selectors. The selector already matches nothing (no element is both
div and span), but the correct output is to leave it unmerged rather than
produce invalid CSS.
