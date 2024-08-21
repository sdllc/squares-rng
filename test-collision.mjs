
import { GenerateKey } from './dist/squares-rng.mjs';

//
// this code checks if there are key collisions with 
// nearby integers. so if there's a risk when generating
// keys from seeds like 100, 101, 102, &c.
//

// how widely to check
const test_scope = 1024 * 4;

// how many seeds to check
const test_range = 1e7;

// starting point
const offset = 0; // Math.round(new Date().getTime()); 

let keys = [];
let i = 0;
let collisions = 0;

for (i = 0; i < test_scope; i++) {
  const key = GenerateKey(i + offset);
  if (keys.includes(key)) {
    console.info('collision @', i);
    collisions++;
  }
  keys.push(key);
}

for (; i < test_range; i++) {
  keys.shift();
  const key = GenerateKey(i + offset);
  if (keys.includes(key)) {
    console.info('collision @', i);
    collisions++;
  }
  keys.push(key);
}

console.info(`found ${collisions} collision${collisions === 1 ? '' : 's'} in ${test_range} keys (within ${test_scope})`);



