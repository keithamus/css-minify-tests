# Remove background properties set to invalid colors

The 5 digit hex value `#00f00` is invalid, so the browser will ignore the
property it is assigned to. This makes it safe to remove.
