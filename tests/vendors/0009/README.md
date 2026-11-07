# Remove IE6-IE9 double `!important` properties

A property ending with more than one `!important` is considered invalid and
ignored by modern browsers. However, Internet Explorer 6-9 would still apply
these styles as if they only had one `!important`. This quirk of the browser
was exploited by some developers as a hack to target styles to IE. Internet
Explorer is a long dead browser, so it is safe to remove these properties
that are ignored by modern browsers.
