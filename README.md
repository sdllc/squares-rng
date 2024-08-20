
# Squares RNG

This is an implementation of Bernard Widynski's [counter-based PRNG][1]. 
The sampling is done in WASM. Relative to a pure-javascript version the 
WASM version is 5x-6x faster. 

We use a cache and sample in blocks to reduce call overhead. When using
the cache, sampling values is on par with calls to `Math.random`. It's 
faster in v8, slower in webkit. Not because webkit runs WASM slowly, but 
because webkit's Math.Random is 2x faster than v8. The WASM runs about the
same in all engines.

TODO: perf table

# Keys

Squares uses a key and a counter. The key needs an appropriate bit pattern
to ensure quality output. We provide a utility method to generate a suitable 
key from an integer seed. This is a low-effort key generator. There are likely
to be collisions, but probably not from nearby seed values.

TODO: test collision rate


# Using

```ts

import { SquaresRNG, GenerateKey } from 'squares-rng';

const key = GenerateKey(123);
console.info(key.toString(16));

/**

bc8f2e15d5c8ef82

 **/

const rng = await SquaresRNG.CreateInstance(key)

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

TODO: API

# Reference

https://arxiv.org/pdf/2004.06278  
https://squaresrng.wixsite.com/rand  

[1]: https://arxiv.org/pdf/2004.06278

