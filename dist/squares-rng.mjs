var a=0xffffffffffffffffn,l=(s=0)=>{let t=BigInt(s);return()=>{t=t+0x9E3779B97F4A7C15n&a;let e=t;return e=(e^e>>30n)*0xBF58476D1CE4E5B9n&a,e=(e^e>>27n)*0x94D049BB133111EBn&a,e^e>>31n}},h=(s=0)=>{s||(s=Math.round(new Date().getTime()+Math.random()*1e6));let t=l(s),e=[],n=0n,i=0n;for(let r=0;r<8;r++)for(i<<=4n;;){let c=t()&0xfn;if(c&&!e.includes(c)){e.push(c),i+=c,n=c;break}}for(let r=0;r<8;r++)for(i<<=4n;;){let c=t()&0xfn;if(c&&c!==n){i+=c,n=c;break}}return i};var m="AGFzbQEAAAABDQJgAn5+AXxgA35+fwADAwIAAQUDAQABBx4DBm1lbW9yeQIABnNhbXBsZQAACHNhbXBsZV9uAAEKqQECbwEEfiAAIAF+IgIiAyABfCEEIAIgAn4gA3wiAkIgiiICIAJ+IAR8IgJCIIoiAiACfiADfCICQiCKIgIgAn4gBHwiAiIFQiCKIgIgAn4gA3xCIIggBYVCDIhCgICAgICAgPg/hL9EAAAAAAAA8D+hCzcBAX9BACEDA0ACQEEAIAJGDQAgAyAAIAEQADkDAEEIIANqIQNCASAAfCEAIAJBAWshAgwBCwsL",o,b,f=async()=>{let s=Uint8Array.from(atob(m||""),n=>n.charCodeAt(0)),t=await WebAssembly.compile(s);o=(await WebAssembly.instantiate(t)).exports,b=new Float64Array(o.memory.buffer)},p=f(),u=class s{key=0n;counter=0n;cache_size=1024*2;cache=new Float64Array(this.cache_size);cache_pointer=this.cache_size;fills=0;constructor(t,e){this.Seed(t,e)}Seed(t,e=0){this.key=h(BigInt(t)),this.counter=BigInt(e),this.cache_pointer=this.cache_size}Jump(t){this.counter+=BigInt(t)}Next(){return this.cache_pointer>=this.cache_size&&(this.Fill(this.cache_size,this.cache),this.cache_pointer=0),this.cache[this.cache_pointer++]}NextN(t,e){e||(e=new Float64Array(t));let n=0;if(this.cache_pointer<this.cache_size){let i=Math.min(t,this.cache_size-this.cache_pointer);if(e.set(this.cache.subarray(this.cache_pointer,this.cache_pointer+i)),this.cache_pointer+=i,i===t)return e;n=i}for(;n<t;){let i=e.subarray(n),r=Math.min(this.cache_size,t-n);this.Fill(r,i),n+=r}return e}static async CreateInstance(t=0,e=0){return await p,new s(t||new Date().getTime(),e)}Fill(t,e){o.sample_n(this.counter,this.key,t),e.set(b.subarray(0,t)),this.counter+=BigInt(t),this.fills++}};export{u as SquaresRNG};
