# Remove IE10/IE11 exclusive media queries

This example contains a `\0` in the media query which is invalid and causes the
entire media query to be ignored by modern browsers. However, Internet Explorer
10 and 11 did not consistently parse integers and as a result do apply the
styles in these queries. But Internet Explorer is a long dead browser, so it is
safe to remove these styles.
