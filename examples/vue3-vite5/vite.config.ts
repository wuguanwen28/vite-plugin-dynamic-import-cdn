import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dynamicImportCdn } from 'vite-plugin-dynamic-import-cdn'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dynamicImportCdn({
      cdnUrlPreset: 'cdnjs',
      modules: ['vue@3', 'vue-router@4', 'dayjs', 'lodash', 'moment', 'axios']
    })
  ]
})
