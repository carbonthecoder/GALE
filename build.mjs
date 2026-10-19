import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  external: ['react', 'ink', 'ink-text-input'],
  outfile: 'dist/cli.mjs',
  format: 'esm',
  jsx: 'automatic',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
