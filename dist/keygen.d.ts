/**
 * generate key from a seed value. we seed a splitmix generator then
 * use that to sample digits, and accept or reject based on rules:
 *
 * digits 1-8: not 0, all different
 * digits 9-16: not 0, no repeating digits
 *
 * @param seed - pass 0 for a random seed
 * @returns key
 */
export declare const GenerateKey: (seed?: number | bigint) => bigint;
