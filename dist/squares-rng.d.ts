export { GenerateKey } from './keygen.js';
export declare class SquaresRNG {
    key: bigint;
    /**
     * current counter. because we use a cache, this does not reflect
     * the index of the Next() value. you could work out that value with
     * `cache_pointer` and `cache_size` though.
     */
    counter: bigint;
    /**
     * cache size. 1-2k seems to be optimal, but it might depend on use pattern.
     */
    protected cache_size: number;
    /**
     * we have a separate cache, instead of just using WASM memory, because
     * we might have parallel instances of this generator, all using the same
     * WASM module. in that case the WASM memory will get overwritten.
     */
    protected cache: Float64Array;
    /**
     * current index into the cache.
     */
    protected cache_pointer: number;
    /**
     * diagnostic value, how often we've filled the cache.
     */
    protected fills: number;
    /** don't call the constructor. use the factory method. */
    protected constructor(key: bigint, start: bigint);
    /**
     * reset to change the key or the counter. in addition to
     * updating the values, it will flush the cache so you don't
     * get stale values.
     *
     * @param key
     * @param start
     */
    Reset(key: bigint, start?: bigint | number): void;
    /** returns a random double in [0, 1] */
    Next(): number;
    /**
     * fills an array with random doubles. you can increase the
     * number of samples in one shot, but not more than 8k or
     * it won't fit in WASM memory (1 64k page).
     */
    NextN(n: number, array?: Float64Array, chunk_size?: number): Float64Array;
    /**
     * create an instance. sets key and counter (default 0).
     *
     * this method is async because WASM is async, and we need to ensure
     * that WASM is initialized before you make any calls to the sample
     * functions.
     *
     */
    static CreateInstance(key: bigint, start_counter?: number | bigint): Promise<SquaresRNG>;
    /** generate n samples */
    protected Fill(n: number, array: Float64Array): void;
}
