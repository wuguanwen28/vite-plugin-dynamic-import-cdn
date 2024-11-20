import { defineConfig, Plugin } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { dynamicImportCdn } from 'vite-plugin-dynamic-import-cdn'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    dynamicImportCdn({
      modules: ['vue@2', 'vue-router@3']
    }) as unknown as Plugin
  ]
})
