import type { HtmlTagDescriptor, Plugin } from 'vite'
import { PluginOptions } from './type'
import externalGlobals from 'rollup-plugin-external-globals'
import {
  getCdnUrl,
  getCustomDescriptor,
  getDynamicImportStr,
  getExternalMap,
  getLoadScriptStr,
  getModuleInfo
} from './utils'

const dynamicImportCdn = (options: PluginOptions): Plugin => {
  let isBuild = false

  let {
    cdnUrl = 'unpkg',
    modules,
    generateScriptTag,
    generateCssLinkTag
  } = options

  cdnUrl = getCdnUrl(cdnUrl)

  let data = modules.map((item) => getModuleInfo(cdnUrl, item))

  let { externalMap, customExternalMap } = getExternalMap(data)
  let externalList = Object.keys(externalMap)
  let customExternalList = Object.keys(customExternalMap)

  return {
    name: 'vite-plugin-dynamic-import-cdn',
    enforce: 'pre',
    apply: 'build',
    config(_, { command }) {
      isBuild = command === 'build'
      return {
        build: {
          rollupOptions: {
            plugins: [
              //@ts-ignore
              externalGlobals((id: string) => {
                if (externalList.includes(id)) return externalMap[id]

                let name = customExternalList.find((item) => id.includes(item))
                if (name) return customExternalMap[name]?.(id)
              })
            ]
          }
        }
      }
    },
    transformIndexHtml(html) {
      if (!isBuild) return html
      const descriptors: HtmlTagDescriptor[] = []

      // 给全局挂载一个动态加载函数
      descriptors.push({
        tag: 'script',
        injectTo: 'head-prepend',
        children: getLoadScriptStr()
      })

      data.forEach((item) => {
        // 创建script标签
        item.pathList.forEach((path) => {
          const cusomize = generateScriptTag?.(item.name, path) || {}
          let descriptor: HtmlTagDescriptor = {
            tag: 'script',
            injectTo: cusomize.injectTo
          }
          if (item.dynamic === undefined) {
            descriptor.attrs = {
              src: path,
              crossorigin: 'anonymous',
              ...(cusomize.attrs || {})
            }
          } else {
            descriptor.children = getDynamicImportStr(item, path)
          }

          descriptors.push(descriptor)
        })

        // 创建css标签
        item.cssList.forEach((path) => {
          const cusomize = generateCssLinkTag?.(item.name, path) || {}
          descriptors.push({
            tag: 'link',
            injectTo: cusomize.injectTo,
            attrs: {
              href: path,
              rel: 'stylesheet',
              crossorigin: 'anonymous',
              ...(cusomize.attrs || {})
            }
          })
        })

        // 自定义标签
        if (item.descriptor) {
          let customDescriptor = getCustomDescriptor(cdnUrl, item)
          descriptors.push(...customDescriptor)
        }
      })

      return descriptors
    }
  }
}

export { dynamicImportCdn, PluginOptions }
