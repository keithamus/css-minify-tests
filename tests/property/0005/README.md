# Remove no-op `@property` rules

`syntax` defaults to `"*"`, `inherits` defaults to `true`, and `initial-value` defaults to guaranteed-invalid. These three registrations use only default values and are equivalent to unregistered custom properties, so they can be safely removed.
