# :where() don't merge when longer

`:where(.foo):where(.a,.b,.c,.d)` should NOT be merged: the cartesian product
`:where(.foo.a,.foo.b,.foo.c,.foo.d)` is 35 chars vs 31 chars unmerged. Merging
always saves 8 chars of wrapper overhead but costs extra chars from duplicating
the first selector; here `4*(4-1)=12 > 8` so keep it is more efficient to keep
them separate.
