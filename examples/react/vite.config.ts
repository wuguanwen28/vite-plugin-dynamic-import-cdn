import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { dynamicImportCdn } from 'vite-plugin-dynamic-import-cdn'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-ignore
    monacoEditorPlugin['default']({}),
    dynamicImportCdn({
      cdnUrlPreset: 'unpkg',
      modules: [
        'react',
        'react-dom',
        'dayjs',
        'moment',
        'antd@5',
        // 只支持全是引入，按需引入的echarts不适用
        {
          dynamic: 'global',
          name: 'echarts',
          var: 'echarts',
          version: '5.5.0', // cdnjs上暂时没有5.5.1版本
          path: 'dist/echarts.min.js'
        },
        {
          name: 'monaco-editor',
          var: 'monacoThenable',
          path: 'min/vs/loader.js',
          descriptor: {
            tag: 'script',
            children: `
      window.monacoThenable = {
        then(resolve) {
          if (typeof window.monaco !== 'undefined') {
            resolve(window.monaco)
            return
          }
          require.config({ paths: { vs: '{baseUrl}/{name}@{version}/min/vs' } })
          require(['vs/editor/editor.main'], function () {
            resolve(window.monaco)
          })
        }
      }
    `
          }
        }
      ]
    })
  ]
})
