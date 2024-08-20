// @ts-check

import * as esbuild from 'esbuild';
import { promises as fs } from 'fs';
import wabt from 'wabt';

/**
 * @typedef {Object} Options
 * @property {'dev'|'production'} version
 * @property {boolean} watch
 * @property {boolean} verbose - log all plugin inputs. helpful for dev/debug.
 * @property {boolean} minify - separate from dev/production, in case we need to test
 */

/** 
 * @type {Options}
 * 
 * defaults to production, we will update from any options 
 * passed at command line. 
 */
const options = {
  version: 'production',
  watch: false,
  minify: true, 
  verbose: false,
};

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--dev') {
    options.version = 'dev';
    options.minify = false;
  }
  if (process.argv[i] === '--watch') {
    options.watch = true;
  }
  if (process.argv[i] === '--verbose') {
    options.verbose = true;
  }
}

/////////////////////////////

const squares_wat = await fs.readFile('./src/squares.wat', {encoding: 'utf8'});
const wabt_instance = await wabt();
const parsed = wabt_instance.parseWat('squares.wat', squares_wat);
const binary = parsed.toBinary({});
const wasm_base64 = btoa(Array.from(binary.buffer).map(char => String.fromCharCode(char)).join(''));

/** @type esbuild.BuildOptions */
const build_options = {
  entryPoints: [
    'src/squares-rng.ts'
  ],
  bundle: true,
  // outdir: 'dist',
  outfile: 'dist/squares-rng.mjs',
  outExtension: { '.js': '.mjs' },
  minify: options.minify,
  metafile: !options.watch,
  format: 'esm',
  define: {
    'process.env.WASM': `"${wasm_base64}"`,
    // 'process.env.XLSX_SUPPORT': `${options.xlsx_support}`,
    // 'process.env.NODE_ENV': `"${options.version}"`,
    // 'process.env.BUILD_VERSION': `"${pkg.version}"`,
    // 'process.env.BUILD_NAME': `"${pkg.name}"`,
  },
  write: true,
  plugins: [
    // RewriteIgnoredImports(),
    // NotifyPlugin(),
    // WorkerPlugin(options),
    // HTMLPlugin(options),
    // SassPlugin(options),
  ],
};

if (options.watch) {
  const context = await esbuild.context(build_options);
  await context.watch();
}
else {
  const result = await esbuild.build(build_options);
  await fs.writeFile('esbuild-metafile.json', JSON.stringify(result.metafile), { encoding: 'utf-8' });
}
