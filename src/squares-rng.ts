
export { GenerateKey } from './keygen.js';

/** esbuild will embed our compiled WASM as a base64 string */
const wasm_base64 = process.env.WASM;

interface SqauresModule { 
  sample: (counter: bigint, key: bigint) => number,
  sample_n: (counter: bigint, key: bigint, n: number) => void,
  memory: WebAssembly.Memory,
};

let wasm: SqauresModule;

/** 
 * this is a constant view into WASM memory as a float array, 
 * so we're not constantly creating and deleting views.
 */
let view: Float64Array;

const Init = async () => {
  const buffer = Uint8Array.from(atob(wasm_base64 || ''), c => c.charCodeAt(0));
  const compiled = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(compiled);
  wasm = instance.exports as unknown as SqauresModule; // there must be a way to do this
  view = new Float64Array(wasm.memory.buffer);
}

/** single promise used by factory method to wait on WASM init. */
const init_promise = Init();

export class SquaresRNG {

  public key = 0n;

  /** 
   * current counter. because we use a cache, this does not reflect
   * the index of the Next() value. you could work out that value with
   * `cache_pointer` and `cache_size` though. 
   */
  public counter = 0n;

  /** 
   * cache size. 1-2k seems to be optimal, but it might depend on use pattern.
   */
  protected cache_size = 1024 * 2;

  /**
   * we have a separate cache, instead of just using WASM memory, because 
   * we might have parallel instances of this generator, all using the same
   * WASM module. in that case the WASM memory will get overwritten.
   */
  protected cache = new Float64Array(this.cache_size);

  /**
   * current index into the cache. 
   */
  protected cache_pointer = this.cache_size;

  /**
   * diagnostic value, how often we've filled the cache.
   */
  protected fills = 0;

  /** don't call the constructor. use the factory method. */
  protected constructor(key: bigint, start: bigint) {
    this.Reset(key, start);
  }

  /**
   * reset to change the key or the counter. in addition to
   * updating the values, it will flush the cache so you don't
   * get stale values.
   * 
   * @param key 
   * @param start 
   */
  public Reset(key: bigint, start: bigint|number = 0) {
    
    this.key = key;
    this.counter = BigInt(start);

    // flush cache
    this.cache_pointer = this.cache_size;

  }

  /** returns a random double in [0, 1] */
  public Next(): number {
    if (this.cache_pointer >= this.cache_size) {
      this.Fill(this.cache_size, this.cache);
      this.cache_pointer = 0;
    }
    return this.cache[this.cache_pointer++];
  }

  /** 
   * fills an array with random doubles. you can increase the
   * number of samples in one shot, but not more than 8k or
   * it won't fit in WASM memory (1 64k page).
   */
  public NextN(n: number, array?: Float64Array, chunk_size = this.cache_size) {

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

    while (count < n) {
      const view = array.subarray(count);
      const take = Math.min(chunk_size, n - count)
      // console.info("filling" + take);
      this.Fill(take, view);
      count += take;
    }

    return array;
  }

  /**
   * create an instance. sets key and counter (default 0).
   * 
   * this method is async because WASM is async, and we need to ensure 
   * that WASM is initialized before you make any calls to the sample 
   * functions. 
   * 
   */
  public static async CreateInstance(key:bigint, start_counter:number|bigint = 0): Promise<SquaresRNG> {
    await init_promise;
    return new SquaresRNG(key, BigInt(start_counter));
  }

  /** generate n samples */
  protected Fill(n: number, array: Float64Array) {
    wasm.sample_n(this.counter, this.key, n);
    array.set(view.subarray(0, n));
    this.counter += BigInt(n);
    this.fills++;
  }
  
}
