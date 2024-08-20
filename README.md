
# Squares RNG

This is an implementation of Bernard Widynski's [counter-based PRNG][1]. 
The sampling is done in WASM. Relative to a pure-javascript version the 
WASM version is 5x-6x faster.

We use a cache and sample in blocks to reduce call overhead. When using
the cache, sampling values is on par with calls to `Math.random`, except
in webkit where it's slower (but webkit's `Math.random` is super fast).

# Reference

https://arxiv.org/pdf/2004.06278

[1]: https://arxiv.org/pdf/2004.06278

