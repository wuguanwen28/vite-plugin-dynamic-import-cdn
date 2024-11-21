# vite-plugin-dynamic-import-cdn

[English](README.en.md) | 简体中文

[![GitHub tag](https://img.shields.io/github/tag/wuguanwen28/vite-plugin-dynamic-import-cdn.svg)](https://github.com/wuguanwen28/vite-plugin-dynamic-import-cdn/releases)
[![License](https://img.shields.io/github/license/wuguanwen28/vite-plugin-dynamic-import-cdn)](https://github.com/wuguanwen28/vite-plugin-dynamic-import-cdn/blob/master/LICENSE)

  * 在生产环境中，可以从CDN中引入依赖，减少构建时间与体积。
  * 如果是动态引入的依赖，也可以动态加载CDN，减少首次请求时间
  
## 参考
  * 本插件基于[vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import)来实现
  * 修复部分预设 modules 在其他CDN路径出错的问题
  * 修复部分依赖构建时，没有 external 成功
  * 增加动态引入CDN资源功能

## 安装
```bash
# npm
npm i vite-plugin-dynamic-import-cdn -D

# yarn
yarn add vite-plugin-dynamic-import-cdn -D

# pnpm
pnpm add vite-plugin-dynamic-import-cdn -D
```

## 基本用法

```js
// vite.config.js
import { defineConfig } from 'vite'
import { dynamicImportCdn } from 'vite-plugin-dynamic-import-cdn'

export default defineConfig({
  plugins: [
    // ...其他插件
    dynamicImportCdn({
      cdnUrlPreset: 'unpkg',
      modules: [
        // 预设模块
        'react',
        'react-dom',
        'dayjs',
        'antd@5',
        // 自定义模块
        {
          dynamic: 'global', // 开启动态加载CDN资源
          name: 'echarts',
          var: 'echarts',
          path: 'dist/echarts.min.js'
        },
      ]
    })
  ]
})
```

### 预设的 npm 包

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


## 参数

### 插件配置
| Name              | Description                      | Type                                         |
| ----------------- | -------------------------------- | -------------------------------------------- |
| cndUrl            | 生成 CND 文件路径的模板 url      | string \| 'jsdelivr' \| 'cdnjs' \| 'unpkg'   |
| modules           | CDN 模块配置                     | (string \| [Module](#module-配置))[]         |
| generateScriptTag | 自定义生成 script 标签属性与位置 | Omit<HtmlTagDescriptor, 'tag' \| 'children'> |
| generateScriptTag | 自定义生成 css 标签属性与位置    | Omit<HtmlTagDescriptor, 'tag' \| 'children'> |

### Module 配置

| Name            | Description                                                     | Type                             |
| --------------- | --------------------------------------------------------------- | -------------------------------- |
| name            | 需要 CDN 加速的包名称                                           | string                           |
| alias           | 名称的别名，例如“react-dom/client”是“react-dom”的别名           | string[]                         |
| var             | 全局分配给模块的变量                                            | string                           |
| path            | 指定 CDN 上的加载路径                                           | string / string[]                |
| css             | 可以指定从 CDN 地址上加载多个样式表                             | string / string[]                |
| version         | 手动配置依赖的版本，pnpm安装获取不到嵌套依赖版本                | string                           |
| dynamic         | 如果项目中为动态引入该依赖 import('echarts')，可开启动态引入cdn | 'esm' \| 'global'                |
| externalGlobals | 自定义全局变量，详情请查看 rollup-plugin-external-globals       | (id: string) => (string \| void) |
| descriptor      | 额外插入的标签，如 lodash 想修改全局名称                        | HtmlTagDescriptor                |

## 转换过程

### 普通引入
``` js
// index.js
import * as echarts from 'echarts'
echarts.init(document.getElementById('main'))

// ----------转换后-------------

// index.html
<script src="https://unpkg.com/echarts@5.5.0/dist/echarts.min.js"></script>

// index.js
echarts.init(document.getElementById('main'))

```

### 动态引入
```js
// index.js
import('echarts').then(echarts => {
  echarts.init(document.getElementById('main'))
})

// ----------转换后-------------

// index.html
window.echartsThenable = {
  then(resolve, reject) {
    if (window.echarts) return resolve(window.echarts)
    // __loadScript__: 一个创建script标签来加载js资源的函数
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

## 资源

- [vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import)来实现
- [rollup-plugin-external-globals](https://github.com/eight04/rollup-plugin-external-globals)