# Respect percents inside `color-mix` in gradients

The `0%` and `100%` used inside the `color-mix` functions must be retained as
they impact how much of the `--x`/`red` to show versus the `#0000` in the mix.
However the `0%` used for the first color stop in the gradient can be implied,
as well as the `100%` used for the last color stop. The `50%` cannot be implied
and must be retained.
