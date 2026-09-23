# Resolve calculations 

Replace the calculation with the result to reduce character count. To balanace
accuracy and decimal point precision with character reduction, take the total
number of characters in the resolved number (including `.`), and ensures it is 7
or less, and it correctly rounds the final digit if needed.

See the following post for decimal precision reasoning:

* https://github.com/keithamus/css-minify-tests/issues/270#issuecomment-5732157509
