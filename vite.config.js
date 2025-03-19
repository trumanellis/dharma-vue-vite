// File: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import lightningcss from 'vite-plugin-lightningcss'

export default defineConfig({
  plugins: [
    vue(), 
    nodePolyfills(),
    lightningcss({
      browserslist: '>= 0.25%',
      minify: true,
    })
  ],
  define: {
    'process': {},
    'global': {},
  },
})
