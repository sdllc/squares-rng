
import { GenerateKey } from './keygen.js';

interface SqauresModule { 
  sample: (counter: bigint, key: bigint) => number,
  sample_n: (counter: bigint, key: bigint, n: number) => void,
  memory: WebAssembly.Memory,
} ;

const wasm_base64 = process.env.WASM;
let wasm: SqauresModule;
let view: Float64Array;

const Init = async () => {
  const buffer = Uint8Array.from(atob(wasm_base64 || ''), c => c.charCodeAt(0));
  const compiled = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(compiled);
  wasm = instance.exports as unknown as SqauresModule; // there must be a way to do this
  view = new Float64Array(wasm.memory.buffer);
}

const init_promise = Init();

export class SquaresRNG {

  public key = 0n;
  public counter = 0n;

  protected cache_size = 1024 * 2;
  protected cache = new Float64Array(this.cache_size);
  protected cache_pointer = this.cache_size;

  protected fills = 0; // diagnostic

  /** don't call the constructor. use the factory method. */
  protected constructor(seed: number|bigint, start: number|bigint) {
    this.Seed(seed, start);
  }

  /**
   * change the seed. generate a new key, reset the counter and flush 
   * any cached samples.
   */
  public Seed(seed: number|bigint, start: number|bigint = 0) {

    // generate key
    this.key = GenerateKey(BigInt(seed));

    // init counter
    this.counter = BigInt(start);

    // flush cache
    this.cache_pointer = this.cache_size;

  }

  public Jump(n: number|bigint) {
    this.counter += BigInt(n);
  }

  public Next(): number {
    if (this.cache_pointer >= this.cache_size) {
      this.Fill(this.cache_size, this.cache);
      this.cache_pointer = 0;
    }
    return this.cache[this.cache_pointer++];
  }

  public NextN(n: number, array?: Float64Array) {

    if (!array) { array = new Float64Array(n); }

    let count = 0;

    // work through our cache first
    if (this.cache_pointer < this.cache_size) {
      const take = Math.min(n, this.cache_size - this.cache_pointer);
      // console.info(`taking ${take} from cache`);
      array.set(this.cache.subarray(this.cache_pointer, this.cache_pointer + take));
      this.cache_pointer += take;
      if (take === n) {
        return array;
      }
      count = take;
    }

    // we're collecting in chunks of (cache size)

    // NOTE: on the last fill here we're (possibly) getting less
    // than the normal chunk size. we should get the same amount
    // and put the remainder back in the cache. TODO.

    while (count < n) {
      const view = array.subarray(count);
      const take = Math.min(this.cache_size, n - count)
      // console.info("filling" + take);
      this.Fill(take, view);
      count += take;
    }

    return array;
  }

  /**
   * create an instance, using a seed to generate the key. optionally 
   * advance the counter.
   */
  public static async CreateInstance(seed:number|bigint = 0, start_counter:number|bigint = 0): Promise<SquaresRNG> {
    await init_promise;
    return new SquaresRNG(seed || new Date().getTime(), start_counter);    
  }

  protected Fill(n: number, array: Float64Array) {
    wasm.sample_n(this.counter, this.key, n);
    array.set(view.subarray(0, n));
    this.counter += BigInt(n);
    this.fills++;
  }
  
}

/*
console.info(wasm_base64.length, wasm_base64);
console.info(rebuffed);
*/