export { GenerateKey } from './keygen.js';
export declare class SquaresRNG {
    key: bigint;
    counter: bigint;
    protected cache_size: number;
    protected cache: Float64Array;
    protected cache_pointer: number;
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
    /** fills an array with random doubles */
    NextN(n: number, array?: Float64Array): Float64Array;
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
