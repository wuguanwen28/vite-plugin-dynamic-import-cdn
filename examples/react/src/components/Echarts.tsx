import { Button, DatePicker, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { ECharts, EChartsOption } from 'echarts'

const LineChartComp: React.FC<any> = () => {
  const container = useRef<HTMLDivElement | null>(null)

  const [myChart, setMyChart] = useState<ECharts>()

  const [loading, setLoading] = useState(false)

  const getData = () => {
    return Array(7)
      .fill(0)
      .map(() => {
        return Math.round(Math.random() * 500 + 100)
      })
  }

  const changeData = () => {
    const option: EChartsOption = {
      title: {
        text: 'Stacked Line'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: getData()
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: getData()
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: getData()
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          data: getData()
        },
        {
          name: 'Search Engine',
          type: 'line',
          stack: 'Total',
          data: getData()
        }
      ]
    }

    myChart?.setOption(option)
  }

  useEffect(() => changeData(), [myChart])

  return (
    <div className="echarts-container">
      <Space>
        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            if (!myChart) {
              setLoading(true)
              import('echarts')
                .then((echarts) => {
                  let myChart = echarts.init(container.current!)
                  setMyChart(myChart)
                })
                .finally(() => setLoading(false))
            } else {
              changeData()
            }
          }}
        >
          动态加载echarts
        </Button>
        <DatePicker style={{ width: '200px' }}></DatePicker>
      </Space>
      <div ref={container}></div>
    </div>
  )
}

export default LineChartComp
