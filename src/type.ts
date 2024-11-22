import { HtmlTagDescriptor } from 'vite'
import { PresetKeys } from './presetConfig'

type NullValue = void | null | undefined

export type Module = {
  /** 依赖名称 */
  name: string
  /**
   * 依赖的全局变量名称，如react-dom: ReactDOM
   */
  var: string
  /**
   * js路径，支持完整路径 {baseUrl}占位符为cdn的基本路径
   * @example "/dist/antd.min.js"
   * @example "{baseUrl}/antd@{version}/dist/antd.min.js"
   * @example "https://cdn.jsdelivr.net/npm/antd@5.22.1/dist/antd.min.js"
   */
  path: string | string[]
  /**
   * css路径
   * @example "/dist/antd.min.css"
   */
  css?: string | string[]
  /**
   * 依赖别名
   * @example "react-dom"的别名: ["react-dom/client"]
   */
  alias?: string[]
  /**
   * 依赖版本，默认获取安装的版本，手动配置时请确保与开发环境的版本一致
   */
  version?: string
  /**
   * 如果项目中为动态引入该依赖 import('echarts')，可开启动态引入cdn
   * cdn引入方式 'esm' | 'global'
   * @example  esm    以esm方式导出 dist/echarts.esm.min.js
   * @example  global 以全局变量(umd/iife)方式导出 dist/echarts.min.js
   */
  dynamic?: 'esm' | 'global'
  /**
   * 自定义全局变量，详情请查看 rollup-plugin-external-globals
   * @param id 引入路径
   * @returns 全局名称
   */
  externalGlobals?: (id: string) => string | NullValue
  /**
   * 额外插入的标签，如 lodash 想修改全局名称
   * @example {tag: 'script', children: 'window._lodash = _.noConflict()}
   */
  descriptor?: HtmlTagDescriptor | HtmlTagDescriptor[]
}

export type PluginOptions = {
  /**
   * CDN基本路径，预设'jsdelivr' | 'cdnjs' | 'unpkg'
   * @example 'https://unpkg.com/{name}@{version}/{path}'
   */
  cdnUrl?: CdnKeys | (string & {})
  /** 模块配置 */
  modules: (Module | PresetKeys)[]
  /** 自定义生成script标签的属性与位置 */
  generateScriptTag?: (
    name: string,
    path: string
  ) => Omit<HtmlTagDescriptor, 'tag' | 'children'>
  /** 自定义生成css标签的属性与位置 */
  generateCssLinkTag?: (
    name: string,
    path: string
  ) => Omit<HtmlTagDescriptor, 'tag' | 'children'>
  /** 
   * 只使用externalGlobals插件
   * 如果你需要使用rollup打包某些CDN包时也许有用
   */
  onlyExternalGlobals?: boolean
}
export type CdnKeys = 'jsdelivr' | 'cdnjs' | 'unpkg'

export type PresetConfig = Partial<Module> & {
  [key in CdnKeys]: Partial<Module>
}
