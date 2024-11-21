# vite-plugin-dynamic-import-cdn

English | [简体中文](README.md)

[![GitHub tag](https://img.shields.io/github/tag/wuguanwen28/vite-plugin-dynamic-import-cdn.svg)](https://github.com/wuguanwen28/vite-plugin-dynamic-import-cdn/releases)
[![License](https://img.shields.io/github/license/wuguanwen28/vite-plugin-dynamic-import-cdn)](https://github.com/wuguanwen28/vite-plugin-dynamic-import-cdn/blob/master/LICENSE)

  * In production environments, dependencies can be loaded from a CDN to reduce build time and bundle size.
  * For dynamically imported dependencies, the CDN resources can also be dynamically loaded to reduce initial request time.

## References
  * This plugin is based on [vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import).
  * Fixes issues with some preset modules not working correctly with certain CDN paths.
  * Fixes some dependencies failing to be `external` during the build process.
  * Adds support for dynamically importing CDN resources.

## Installation
```bash
# npm
npm i vite-plugin-dynamic-import-cdn -D

# yarn
yarn add vite-plugin-dynamic-import-cdn -D

# pnpm
pnpm add vite-plugin-dynamic-import-cdn -D
```

## Basic Usage

```js
// vite.config.js
import { defineConfig } from 'vite'
import { dynamicImportCdn } from 'vite-plugin-dynamic-import-cdn'

export default defineConfig({
  plugins: [
    // ...other plugins
    dynamicImportCdn({
      cdnUrlPreset: 'unpkg',
      modules: [
        // Preset modules
        'react',
        'react-dom',
        'dayjs',
        'antd@5',
        // Custom modules
        {
          dynamic: 'global', // Enable dynamic loading of CDN resources
          name: 'echarts',
          var: 'echarts',
          path: 'dist/echarts.min.js'
        },
      ]
    })
  ]
})
```

## Preset npm Packages

- react
- react-dom
- react-router-dom
- antd@5
- antd@4
- vue@3
- vue@2
- vue-router@4
- vue-router@3
- moment
- dayjs
- axios
- lodash

## Parameters

### Plugin Configuration

| Name              | Description                                | Type                                          |
| ----------------- | ------------------------------------------ | --------------------------------------------- |
| cndUrl            | Template URL for generating CDN file paths | string \| 'jsdelivr' \| 'cdnjs' \| 'unpkg'    |
| modules           | Configuration for CDN modules              | (string \| [Module](#module-configuration))[] |
| generateScriptTag | Customizes the generated script tag        | Omit<HtmlTagDescriptor, 'tag' \| 'children'>  |
| generateCssTag    | Customizes the generated CSS tag           | Omit<HtmlTagDescriptor, 'tag' \| 'children'>  |

### Module Configuration

| Name            | Description                                                              | Type                             |
| --------------- | ------------------------------------------------------------------------ | -------------------------------- |
| name            | Name of the package to be accelerated by the CDN                         | string                           |
| alias           | Alias for the name, e.g., `react-dom/client` is an alias for `react-dom` | string[]                         |
| var             | Global variable assigned to the module                                   | string                           |
| path            | Specific CDN path for loading                                            | string \| string[]               |
| css             | Stylesheets to load from the CDN                                         | string \| string[]               |
| version         | Manually specify the dependency version if it can't be resolved          | string                           |
| dynamic         | Enable dynamic CDN import for dynamically imported modules               | 'esm' \| 'global'                |
| externalGlobals | Customizes global variables; see [rollup-plugin-external-globals]        | (id: string) => (string \| void) |
| descriptor      | Additional tags to insert, e.g., for modifying the global name of lodash | HtmlTagDescriptor                |

## Conversion Process

### Standard Import
```js
// index.js
import * as echarts from 'echarts'
echarts.init(document.getElementById('main'))

// ----------After Conversion-------------

// index.html
<script src="https://unpkg.com/echarts@5.5.0/dist/echarts.min.js"></script>

// index.js
echarts.init(document.getElementById('main'))
```

### Dynamic Import
```js
// index.js
import('echarts').then(echarts => {
  echarts.init(document.getElementById('main'))
})

// ----------After Conversion-------------

// index.html
window.echartsThenable = {
  then(resolve, reject) {
    if (window.echarts) return resolve(window.echarts)
    // __loadScript__: A function to create a script tag for loading JS resources
    window.__loadScript__("https://unpkg.com/echarts@5.5.0/dist/echarts.min.js")
      .then(() => {
        resolve(window.echarts)
      })
      .catch((err) => {
        reject(err)
      })
  }
}

// index.js
Promise.resolve(echartsThenable).then(echarts => {
  echarts.init(document.getElementById('main'))
})
```

## Resources

- Based on [vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import).
- Uses [rollup-plugin-external-globals](https://github.com/eight04/rollup-plugin-external-globals).