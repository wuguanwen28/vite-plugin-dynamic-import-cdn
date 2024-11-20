import { ConfigProvider } from 'antd'
import './App.css'
import LineChartComp from './components/Echarts'
import { Editor } from './components/Editor'

import zhCN from 'antd/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

import moment from 'moment'
// @ts-ignore
import 'moment/dist/locale/zh-cn'

function App() {
  console.log('moment ==> ', moment().format('LLL'))
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <Editor />
        <LineChartComp />
      </div>
    </ConfigProvider>
  )
}

export default App
