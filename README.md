
# Squares RNG

This is an implementation of the [Squares counter-based PRNG][1]. For this 
version we dropped emscripten and just wrote wasm (wat) by hand. Much smaller
and slightly faster.

To keep things simple this one does key generation on the JS side. We could 
move that to WASM later if desired.

For performance, it's still advisable to sample in blocks of n (1024 - 2048
seem optimal). The class uses a cache to pass through sampling.

[1]: https://arxiv.org/pdf/2004.06278

