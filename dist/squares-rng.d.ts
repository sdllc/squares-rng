export declare class SquaresRNG {
    key: bigint;
    counter: bigint;
    protected cache_size: number;
    protected cache: Float64Array;
    protected cache_pointer: number;
    protected fills: number;
    /** don't call the constructor. use the factory method. */
    protected constructor(seed: number | bigint, start: number | bigint);
    /**
     * change the seed. generate a new key, reset the counter and flush
     * any cached samples.
     */
    Seed(seed: number | bigint, start?: number | bigint): void;
    Jump(n: number | bigint): void;
    Next(): number;
    NextN(n: number, array?: Float64Array): Float64Array;
    /**
     * create an instance, using a seed to generate the key. optionally
     * advance the counter.
     */
    static CreateInstance(seed?: number | bigint, start_counter?: number | bigint): Promise<SquaresRNG>;
    protected Fill(n: number, array: Float64Array): void;
}
