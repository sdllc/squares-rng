

const mask = 0xffffffffffffffffn;

const SplitMix = (seed:number|bigint = 0) => {
  let x = BigInt(seed);

  return () => {
    x = (x + 0x9E3779B97F4A7C15n) & mask;
    let z = x;
    z = (((z ^ (z >> 30n))) * 0xBF58476D1CE4E5B9n & mask);
    z = (((z ^ (z >> 27n))) * 0x94D049BB133111EBn & mask);
    return z ^ (z >> 31n) ;
  };
}

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
export const GenerateKey = (seed: number|bigint = 0): bigint => {

  if (!seed) { 
    seed = Math.round(new Date().getTime() + Math.random() * 1e6);
  };

  const rng = SplitMix(seed);

  const digits: BigInt[] = [];
  let last_digit = 0n;
  let key = 0n;

  for (let i = 0; i < 8; i++) {
    key <<= 4n;
    for (;;) {
      const digit = rng() & 0xfn;
      if (digit && !digits.includes(digit)) {
        digits.push(digit);
        key += digit;
        last_digit = digit;
        break;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    key <<= 4n;
    for (;;) {
      const digit = rng() & 0xfn;
      if (digit && digit !== last_digit) {
        key += digit;
        last_digit = digit;
        break;
      }
    }
  }
 
  return key;

};
