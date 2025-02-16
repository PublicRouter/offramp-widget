import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.tsx',
  external: ['react', 'react-dom'],
  output: [
    {
      file: 'dist/index.js', // Changed from 'build' to 'dist'
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    typescript({
      useTsconfigDeclarationDir: true,
      exclude: 'node_modules/**'
    }),
    postcss({
      extract: false, // Inline styles to the JS file
      modules: false, // Don't use CSS modules
      // plugins: [require('tailwindcss'), require('autoprefixer')]
      plugins: [require('@tailwindcss/postcss')]
    })
  ],
  watch: {
    include: 'src/**', // Only watch files inside 'src/'
    exclude: 'dist/**' // Exclude 'dist/' from being watched
  }
};
