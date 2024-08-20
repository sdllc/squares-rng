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
    Reset(key: bigint, start?: bigint | number): void;
    Next(): number;
    NextN(n: number, array?: Float64Array): Float64Array;
    /**
     * create an instance, using a seed to generate the key. optionally
     * advance the counter.
     */
    static CreateInstance(key: bigint, start_counter?: number | bigint): Promise<SquaresRNG>;
    protected Fill(n: number, array: Float64Array): void;
}
