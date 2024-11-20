import * as fs from 'fs'
import * as path from 'path'
import { presetConfig, PresetKeys } from './presetConfig'
import { CdnKeys, Module, PresetConfig } from './type'
import { HtmlTagDescriptor } from 'vite'

export const pluginName = '[dynamic-import-cdn] '

function isJsdelivr(prodUrl: string) {
  return prodUrl.includes('//cdn.jsdelivr.net')
}

function isUnpkg(prodUrl: string) {
  return prodUrl.includes('//unpkg.com')
}

function isCdnjs(prodUrl: string) {
  return prodUrl.includes('//cdnjs.cloudflare.com')
}

export function autoComplete(cdnUrl: string, name: PresetKeys): Module {
  const config = presetConfig[name] as PresetConfig

  if (!config) throw new Error(`${pluginName}没有预设此模块${name}`)

  let key: CdnKeys | '' = isJsdelivr(cdnUrl)
    ? 'jsdelivr'
    : isUnpkg(cdnUrl)
      ? 'unpkg'
      : isCdnjs(cdnUrl)
        ? 'cdnjs'
        : ''

  if (!key) throw new Error(`${pluginName}没有预设此 CDN 源`)

  let cndConfig = config[key] || {}

  let expectVersion = name.split('@')?.[1]

  return {
    name,
    ...config,
    ...cndConfig,
    expectVersion
  } as Module
}

export const getModuleInfo = (cdnUrl: string, item: Module | PresetKeys) => {
  if (typeof item === 'string') item = autoComplete(cdnUrl, item)

  let path = item.path || []
  if (typeof path === 'string' && path) path = [path]

  let css = item.css || []
  if (typeof css === 'string' && css) css = [css]

  item.version = getModuleVersion(item, path[0])

  // @ts-ignore
  if (item.expectVersion && item.version[0] !== item.expectVersion) {
    throw new Error(
      // @ts-ignore
      `${pluginName} ${item.name}版本不匹配，当前安装的版本为：${item.version}，CDN版本为：${item.expectVersion}`
    )
  }

  let pathList = (path as string[]).map((v) =>
    replaceUrl({ name: item.name, version: item.version!, path: v, cdnUrl })
  )

  let cssList = (css as string[]).map((v) =>
    replaceUrl({ name: item.name, version: item.version!, path: v, cdnUrl })
  )

  return {
    ...item,
    cssList,
    pathList
  }
}

export const getExternalMap = (data: Module[]) => {
  let customExternalMap = {}
  let externalMap = data.reduce((obj, item) => {
    let { name, var: globalName, alias, dynamic } = item
    if (dynamic !== undefined) globalName = `${globalName}Thenable`

    if (Array.isArray(alias)) {
      alias.forEach((alias) => (obj[alias] = globalName))
    }

    if (typeof item.externalGlobals === 'function') {
      customExternalMap[item.name] = item.externalGlobals
      return obj
    }

    return (obj[name] = globalName), obj
  }, {})

  return {
    externalMap,
    customExternalMap
  }
}

/**
 * 获取模块版本号
 */
function getModuleVersion(item: Module, jsPath: string): string | undefined {
  let { name, version } = item
  if (version) return version
  if (isFullPath(jsPath) && !jsPath.includes('{version}')) return version

  const pwd = process.cwd()
  const pkgFile = path.join(pwd, 'node_modules', name, 'package.json')
  if (fs.existsSync(pkgFile)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
    return pkgJson.version
  } else {
    throw new Error(
      `${pluginName}${name}依赖不存在，请先安装依赖或手动配置版本`
    )
  }
}

/**
 * 是否完整的 url
 * @param path
 * @returns
 */
function isFullPath(path: string) {
  if (!path) return false
  return path.startsWith('{baseUrl}') ||
    path.startsWith('http:') ||
    path.startsWith('https:') ||
    path.startsWith('//')
    ? true
    : false
}

type ReplaceUrlOptions = {
  path: string
  name: string
  version: string
  cdnUrl: string
}

function replaceUrl({ path, name, version, cdnUrl }: ReplaceUrlOptions) {
  let cdnBaseUrl = cdnUrl.split('{name}')[0] || ''

  let result = ''

  if (isFullPath(path)) {
    result = path
      .replace(/\{baseUrl\}/g, cdnBaseUrl)
      .replace(/\{version\}/g, version!)
      .replace(/\{name\}/g, name)
  } else {
    result = cdnUrl
      .replace(/\{name\}/g, name)
      .replace(/\{path\}/g, path)
      .replace(/\{version\}/g, version!)
  }

  /**
   * fix: cdn.jsdelivr.net 的路径中有双斜线，会获取不到文件
   * @example https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
   * @example https://cdn.jsdelivr.net/npm/react@18.3.1//umd/react.production.min.js
   */
  return result.replace(/([^:])\/\//g, '$1/')
}

export const getCustomDescriptor = (
  cdnUrl: string,
  { descriptor, version, name }: Module
) => {
  if (!descriptor) return []
  let list = Array.isArray(descriptor) ? descriptor : [descriptor]
  let cdnBaseUrl = cdnUrl.split('{name}')[0]
  if (cdnBaseUrl[cdnBaseUrl.length - 1] !== '/') cdnBaseUrl += '/'
  const dfs = (list: HtmlTagDescriptor[]) => {
    return list.map((item) => {
      let children = item.children
      if (typeof children === 'string') {
        children = children
          .replace(/\{name\}/g, name)
          .replace(/\{version\}/g, version!)
          .replace(/\{baseUrl\}\/?/g, cdnBaseUrl)
      } else if (Array.isArray(children)) {
        children = dfs(children)
      }
      return {
        ...item,
        children
      }
    })
  }

  return dfs(list)
}

export function getLoadScriptStr() {
  return `
    window.__loadScript__ = function (url, callback) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        document.body.appendChild(script)
        script.onerror = reject
        script.onload = () => {
          resolve(true)
          callback && callback()
        }
      })
    }
  `
}

export function getDynamicImportStr(data: Module, path: string) {
  const { var: globalName, dynamic } = data
  let esm = `import("${path}")
          .then((res) => resolve(res))
          .catch((err) => reject(err))`

  let iife = `if (window.${globalName}) return resolve(window.${globalName})
        // 部分库的以umd方式导出，会优先使用amd，需要暂时禁用
        // bug：加载期间使用amd会报错
        let rawDefine = window.define
        let rawRequire = window.require
        window.define = undefined
        window.require = undefined
        window.__loadScript__("${path}")
          .then(() => {
            resolve(window.${globalName})
            window.define = rawDefine
            window.require = rawRequire
          })
          .catch((err) => {
            reject(err)
            window.define = rawDefine
            window.require = rawRequire
          })`

  return `
    window.${globalName}Thenable = {
      then(resolve, reject) {
        ${dynamic === 'esm' ? esm : iife}
      }
    }
  `
}
