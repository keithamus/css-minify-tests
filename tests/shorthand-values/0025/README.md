# Retain `0 0` in `flex` declaration

The property/value pair of `flex: 0 0` is shorthand for:

```css
flex-grow: 0;
flex-shrink: 0;
flex-basis: 0%;
```

However, `flex: 0` means:

```css
flex-grow: 0;
flex-shrink: 1;
flex-basis: 0%;
```

So `flex: 0 0` cannot be shortened to `flex: 0`.
