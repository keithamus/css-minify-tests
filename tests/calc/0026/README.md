# Convert multiply by decimal to divide by whole number in calc

When a decimal is used for multiplication and it is between 0 and 1, take it and
put it in a fraction over 1.

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mn>0.25</mn>
  <mo>=</mo>
  <mfrac>
    <mn>0.25</mn>
    <mn>1</mn>
  </mfrac>
</math>

Then multiply the top and bottom by `10` to the power of however many decimal
places there are. For `.25` you'd use 10<sup>2</sup> (`100`), for `.0625` you'd
use 10<sup>4</sup> (`10000`).

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mfrac>
    <mn>0.25</mn>
    <mn>1</mn>
  </mfrac>
  <mo>&#x00D7;</mo>
  <mfrac>
    <mn>100</mn>
    <mn>100</mn>
  </mfrac>
  <mo>=</mo>
  <mfrac>
    <mn>25</mn>
    <mn>100</mn>
  </mfrac>
</math>

Find the Greatest Common Factor (GCF) of the top and bottom, if it exists, and
reduce the fraction by dividing both numerator and denominator by the GCF.

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mfrac>
    <mrow>
      <mn>25</mn>
      <mo>&#x00F7;</mo>
      <mn>25</mn>
    </mrow>
    <mrow>
      <mn>100</mn>
      <mo>&#x00F7;</mo>
      <mn>25</mn>
    </mrow>
  </mfrac>
  <mo>=</mo>
  <mfrac>
    <mn>1</mn>
    <mn>4</mn>
  </mfrac>
</math>

After division, if the top value is `1`, then you can use the bottom
(denominator) as a replacement in your CSS `calc`, and convert from
multiplication to division.

**Examples:**

* `calc(var(--x)*.5)` => `calc(var(--x)/2)`
* `calc(var(--x)*.25)` => `calc(var(--x)/4)`
* `calc(var(--x)*.05)` => `calc(var(--x)/20)`
* `calc(var(--x)*.03125)` => `calc(var(--x)/32)`
