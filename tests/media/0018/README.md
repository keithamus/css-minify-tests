# Drop repeated media type when merging nested `@media`

The inner query already requires `screen`, so the outer `@media screen` adds
nothing. Merging leaves a single `screen and (width>=768px)` query.
