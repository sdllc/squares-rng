
# Squares RNG

This is an implementation of Bernard Widynski's [counter-based PRNG][1]. 
The sampling is done in WASM. Relative to a pure-javascript version the 
WASM version is 5x-6x faster.

We use a cache and sample in blocks to reduce call overhead. When using
the cache, sampling values is on par with calls to `Math.random`, except
in webkit where it's slower (but webkit's `Math.random` is super fast).

# Using

```ts

import { SquaresRNG } from 'squares-rng';

const rng = await SquaresRNG.CreateInstance(123)

console.info(rng.key.toString());

/**

bc8f2e15d5c8ef82

 **/

for (let i = 0; i< 8; i++) {
  console.info(rng.Next().toFixed(5));
}

/**

0.80028
0.46273
0.33456
0.44465
0.71814
0.54016
0.39462
0.66978

**/

```

# Reference

https://arxiv.org/pdf/2004.06278

[1]: https://arxiv.org/pdf/2004.06278

