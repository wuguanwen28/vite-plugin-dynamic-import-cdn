import { Module, PresetConfig } from './type'

export const presetConfig = {
  react: {
    var: 'React',
    path: 'umd/react.production.min.js'
  },
  'react-dom': {
    var: 'ReactDOM',
    alias: ['react-dom/client'],
    path: 'umd/react-dom.production.min.js'
  },
  'react-router-dom': {
    var: 'ReactRouterDOM',
    path: 'dist/umd/react-router-dom.production.min.js',
    cdnjs: {
      path: 'react-router-dom.production.min.js'
    }
  },
  'antd@5': {
    name: 'antd',
    var: 'antd',
    path: 'dist/antd.min.js',
    css: 'dist/reset.css',
    cdnjs: {
      path: 'antd.min.js',
      css: 'reset.css'
    }
  },
  'antd@4': {
    name: 'antd',
    var: 'antd',
    path: 'dist/antd.min.js',
    css: 'dist/antd.min.css',
    cdnjs: {
      path: 'antd.min.js',
      css: 'antd.min.css'
    }
  },

  'vue@3': {
    name: 'vue',
    var: 'Vue',
    path: 'dist/vue.runtime.global.prod.js',
    cdnjs: {
      path: 'vue.runtime.global.prod.js'
    }
  },
  'vue@2': {
    name: 'vue',
    var: 'Vue',
    path: 'dist/vue.runtime.min.js',
    cdnjs: {
      path: 'vue.runtime.min.js'
    }
  },
  'vue-router@4': {
    name: 'vue-router',
    var: 'VueRouter',
    path: 'dist/vue-router.global.prod.js',
    cdnjs: {
      path: 'vue-router.global.min.js'
    }
  },
  'vue-router@3': {
    name: 'vue-router',
    var: 'VueRouter',
    path: 'dist/vue-router.min.js',
    cdnjs: {
      path: 'vue-router.min.js'
    }
  },

  moment: {
    var: 'moment',
    path: 'min/moment.min.js',
    externalGlobals(id: string) {
      /**
       * fix: moment的语言包会以 '../moment' 引入moment，导致moment也会被打包进来
       */
      if (id === 'moment' || id === '../moment') return 'moment'
    },
    cdnjs: {
      path: '{baseUrl}/moment.js/{version}/moment.min.js'
    }
  },
  dayjs: {
    var: 'dayjs',
    path: 'dayjs.min.js'
  },
  axios: {
    var: 'axios',
    path: 'dist/axios.min.js',
    cdnjs: {
      path: 'axios.min.js'
    }
  },
  lodash: {
    var: '_',
    path: '/lodash.min.js',
    externalGlobals(id: string) {
      if (id === 'lodash' || id === 'lodash-es') return '_lodash'
      // 整合 lodash 与 lodash-es
      let match = id.match(/^(lodash(-es)?\/?([a-zA-Z0-9-_]+)?)$/)
      if (match) return `_lodash.${match[3]}`
    },
    // 需要改名，与amis内部有命名冲突
    descriptor: {
      tag: 'script',
      children: 'window._lodash = _.noConflict()'
    },
    cdnjs: {
      path: '{baseUrl}/lodash.js/{version}/lodash.min.js'
    }
  }
}

export type PresetKeys = keyof typeof presetConfig
