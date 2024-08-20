/**
 * generate a key from a seed value. we seed a splitmix generator then
 * use that to sample digits, and accept or reject based on key rules
 * observed in the test program.
 *
 * @param seed - pass 0 for a random seed
 * @returns key
 */
export declare const GenerateKey: (seed?: number | bigint) => bigint;
