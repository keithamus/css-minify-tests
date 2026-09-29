# Resolve with correct PEMDAS order of operations

In this example `-1 * (1rem + 16px) / 2`, the parentheses go first, but cannot
be resolved any further because of differing relative vs absolute units. Then
the multiplication is applied, creating `(-1rem + -16px) / 2`. This can be
represented as a fraction:

<math display="block">
  <mfrac>
    <mrow>
      <mn>-1rem</mn>
      <mo>−</mo>
      <mn>16px</mn>
    </mrow>
    <mn>2</mn>
  </mfrac>
</math>

Which allows dividing each part of the numerator by the denominator, like so:
`(-1rem / 2) - (16px / 2)`. Which can be resolved to `-.5rem - 8px`.
