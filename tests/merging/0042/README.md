# Partial merge with override after removing duplicate rule

The first and last rule are completely identical, meaning the earlier one serves
no purpose and can safely be removed. After that, the `.a` and `.b` rules share
a commpon property/value pair (`color:red`) and a common property (`margin`).
By appending `.b` to the first rule's selector list (`.a,.b`) they both receive
all properties. The `.b` rule then can remove it's `color:red` and simply
override the `margin` with its own unique value.
