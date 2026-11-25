# Remove media query that serves no purpose

Here the media query is only targeting one selector, and changing one property
that is already previously targeted with that exact declaration. This means
there will be no visual change when the query is applied, and it can safely be
removed.
