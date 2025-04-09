import { ScatterChartPropsInterface } from "./type";
import { ReactEcharts, Echarts, EchartsStat } from '@hulk/common';

export enum ScatterChartCategory {
  Basic = 'Basic',
  Cluster = 'Cluster',
  ExponentialRegression = 'ExponentialRegression',
  LogarithmicRegression = 'LogarithmicRegression',
  DistibutionAndAggregate = 'DistibutionAndAggregate',
  SingleAxis = 'SingleAxis',
  Calendar = 'Calendar',
}

export function generateBasicScatterChartOption({
  category, yData, symbolSize, clusterCount
}: {
} & ScatterChartPropsInterface): echarts.EChartsOption {
  const CLUSTER_COUNT = clusterCount ?? 6;
  const DIENSIION_CLUSTER_INDEX = 2;
  const COLOR_ALL = [
    '#37A2DA',
    '#e06343',
    '#37a354',
    '#b55dba',
    '#b5bd48',
    '#8378EA',
    '#96BFFF'
  ];
  const pieces: { value: number; label: string; color: string; }[] = [];
  for (let i = 0; i < CLUSTER_COUNT; i++) {
    pieces.push({
      value: i,
      label: 'cluster ' + i,
      color: COLOR_ALL[i]
    });
  }

  return category === ScatterChartCategory.Cluster ? {
    dataset: [
      {
        // @ts-ignore
        source: yData
      },
      {
        transform: {
          type: 'ecStat:clustering',
          // print: true,
          config: {
            clusterCount: CLUSTER_COUNT,
            outputType: 'single',
            outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
          }
        }
      }
    ],
    tooltip: {
      position: 'top'
    },
    visualMap: {
      type: 'piecewise',
      top: 'middle',
      min: 0,
      max: CLUSTER_COUNT,
      left: 10,
      splitNumber: CLUSTER_COUNT,
      dimension: DIENSIION_CLUSTER_INDEX,
      pieces: pieces
    },
    grid: {
      left: 120
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'scatter',
      encode: { tooltip: [0, 1] },
      symbolSize,
      itemStyle: {
        borderColor: '#555'
      },
      datasetIndex: 1
    }
  } : {
    xAxis: {},
    yAxis: {},
    // @ts-ignore
    series: [
      {
        symbolSize,
        data: yData,
        type: 'scatter'
      }
    ]
  };
}

export function generateSingleAxisScatterChartOption({
  xData, yData, additionalXData, symbolSize
}: {
} & ScatterChartPropsInterface): echarts.EChartsOption {
  const title: echarts.TitleComponentOption[] = [];
  const singleAxis: echarts.SingleAxisComponentOption[] = [];
  const series: echarts.ScatterSeriesOption[] = [];
  const hours = additionalXData ?? [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'
  ];

  if (xData && yData) {
    xData.forEach(function (day, idx) {
      title.push({
        textBaseline: 'middle',
        top: ((idx + 0.5) * 100) / 7 + '%',
        text: day
      });
      singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx * 100) / 7 + 5 + '%',
        height: 100 / 7 - 10 + '%',
        axisLabel: {
          interval: 2
        }
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function (dataItem) {
          return dataItem[1] * (symbolSize ?? 4);
        }
      });
    });

    yData.forEach(function (dataItem) {
      // @ts-ignore
      (series as any)[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });
  }

  return {
    tooltip: {
      position: 'top'
    },
    title: title,
    singleAxis: singleAxis,
    series: series
  }
}

export function generateLogarithmicScatterChartOption({
  yData
}: {
} & ScatterChartPropsInterface): echarts.EChartsOption {


  return {
    dataset: [
      {
        // @ts-ignore
        source: yData
      },
      {
        transform: {
          type: 'filter',
          config: { dimension: 4, eq: 1990 }
        }
      },
      {
        transform: {
          type: 'filter',
          config: { dimension: 4, eq: 2015 }
        }
      },
      {
        transform: {
          type: 'ecStat:regression',
          config: {
            method: 'logarithmic'
          }
        }
      }
    ],
    title: {
      text: '1990 and 2015 per capita life expectancy and GDP',
      left: 'center'
    },
    legend: {
      data: ['1990', '2015'],
      bottom: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    visualMap: {
      show: false,
      dimension: 2,
      min: 20000,
      max: 1500000000,
      seriesIndex: [0, 1],
      inRange: {
        symbolSize: [10, 70]
      }
    },
    series: [
      {
        name: '1990',
        type: 'scatter',
        datasetIndex: 1
      },
      {
        name: '2015',
        type: 'scatter',
        datasetIndex: 2
      },
      {
        name: 'line',
        type: 'line',
        smooth: true,
        datasetIndex: 3,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: { dx: -20 },
        encode: { label: 2, tooltip: 1 }
      }
    ]
  }
}

export function generateDistributionScatterChartOption({
  yData, symbolSize, distributionType
}: {
  distributionType: string
} & ScatterChartPropsInterface): echarts.EChartsOption {

  function calculateAverage(data, dim) {
    let total = 0;
    for (var i = 0; i < data.length; i++) {
      total += data[i][dim];
    }
    return (total /= data.length);
  }

  return distributionType === 'scatter' ? {
    title: {
      text: 'Male and female height and weight distribution',
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '7%',
      containLabel: true
    },
    tooltip: {
      // trigger: 'axis',
      showDelay: 0,
      formatter: function (params: any) {
        if (params.value.length > 1) {
          return (
            params.seriesName +
            ' :<br/>' +
            params.value[0] +
            'cm ' +
            params.value[1] +
            'kg '
          );
        } else {
          return (
            params.seriesName +
            ' :<br/>' +
            params.name +
            ' : ' +
            params.value +
            'kg '
          );
        }
      },
      axisPointer: {
        show: true,
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      }
    },
    toolbox: {
      feature: {
        dataZoom: {},
        brush: {
          type: ['rect', 'polygon', 'clear']
        }
      }
    },
    brush: {},
    legend: {
      data: ['Female', 'Male'],
      left: 'center',
      bottom: 10
    },
    xAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} cm'
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value} kg'
        },
        splitLine: {
          show: false
        }
      }
    ],
    // @ts-ignore
    series: [
      {
        symbolSize,
        name: 'Female',
        id: 'female',
        dataGroupId: 'female',
        universalTransition: {
          enabled: true,
          delay: function (idx, count) {
            return Math.random() * 400;
          }
        },
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        // @ts-ignore
        data: yData[0],
        markArea: {
          silent: true,
          itemStyle: {
            color: 'transparent',
            borderWidth: 1,
            borderType: 'dashed'
          },
          data: [
            [
              {
                name: 'Female Data Range',
                xAxis: 'min',
                yAxis: 'min'
              },
              {
                xAxis: 'max',
                yAxis: 'max'
              }
            ]
          ]
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          lineStyle: {
            type: 'solid'
          },
          data: [{ type: 'average', name: 'AVG' }, { xAxis: 160 }]
        }
      },
      {
        symbolSize,
        name: 'Male',
        id: 'male',
        dataGroupId: 'male',
        universalTransition: {
          enabled: true,
          delay: function (idx, count) {
            return Math.random() * 400;
          }
        },
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        // @ts-ignore
        data: yData[1],
        markArea: {
          silent: true,
          itemStyle: {
            color: 'transparent',
            borderWidth: 1,
            borderType: 'dashed'
          },
          data: [
            [
              {
                name: 'Male Data Range',
                xAxis: 'min',
                yAxis: 'min'
              },
              {
                xAxis: 'max',
                yAxis: 'max'
              }
            ]
          ]
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          lineStyle: {
            type: 'solid'
          },
          data: [{ type: 'average', name: 'Average' }, { xAxis: 170 }]
        }
      }
    ]
  } : {
    xAxis: {
      type: 'category',
      data: ['Female', 'Male']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        id: 'total',
        data: [
          {
            // @ts-ignore
            value: calculateAverage(yData[1], 0),
            groupId: 'male'
          },
          {
            // @ts-ignore
            value: calculateAverage(yData[0], 0),
            groupId: 'female'
          }
        ],
        universalTransition: {
          enabled: true,
          seriesKey: ['female', 'male'],
          delay: function (idx, count) {
            return Math.random() * 400;
          }
        }
      }
    ]
  }
}


export function generateCalendarScatterChartOption({
  xData, yData, symbolSize
}: {
} & ScatterChartPropsInterface): echarts.EChartsOption {

  function getVirtualData() {
    const dayTime = 3600 * 24 * 1000;
    const data: [string, number][] = [];
    if (yData && yData.length > 0 && xData && xData.length) {
      return yData.filter(([dateStr]) =>
        xData.some(prefix => `${dateStr}`.startsWith(prefix))
      );
    }
    if (xData && xData.length) {
      for (let i = 0; i < xData?.length; i += 1) {
        const [yearStr, monthStr] = xData[i].split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);
        const monthStart = +Echarts.time.parse(`${year}-${monthStr}-01`);

        // 构造下一个月（注意年份进位）
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthStr = String(nextMonth).padStart(2, '0');

        const monthEnd = +Echarts.time.parse(`${nextYear}-${nextMonthStr}-01`);
        console.log(monthStart, monthEnd)
        for (let time = monthStart; time < monthEnd; time += dayTime) {
          data.push([
            Echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
            Math.floor(Math.random() * 1000)
          ]);
        }
      }
    }
    return data;
  }

  const allSeries = [
    {
      type: 'graph',
      edgeSymbol: ['none', 'arrow'],
      coordinateSystem: 'calendar',
      symbolSize,
      calendarIndex: 0,
      data: getVirtualData()
    },
    {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData()
    },
    {
      type: 'effectScatter',
      coordinateSystem: 'calendar',
      symbolSize: function (val: any) {
        return val[1] / 40;
      },
      data: getVirtualData()
    },
    {
      type: 'scatter',
      coordinateSystem: 'calendar',
      symbolSize: function (val: any) {
        return val[1] / 60;
      },
      data: getVirtualData()
    },
    {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData()
    }
  ];

  function getSeriesByXDataLength(xDataLength: number): echarts.SeriesOption[] {
    if (xDataLength <= 1) {
      // @ts-ignore
      return allSeries.slice(0, 2); // 返回前两个
    }

    const count = Math.min(xDataLength + 1, allSeries.length);
    const selected = allSeries.slice(0, count);

    // 修正 calendarIndex
    // @ts-ignore
    return selected.map((series, index) => {
      if (index === 0) return series; // 第一个 graph 不变
      return {
        ...series,
        calendarIndex: index - 1
      };
    });
  }

  return {
    tooltip: {
      position: 'top'
    },

    visualMap: [
      {
        min: 0,
        max: 1000,
        calculable: true,
        seriesIndex: xData && xData.length > 0 ? Array.from({ length: xData.length - 1 }, (_, i) => i + 2) : [2, 3, 4],
        orient: 'horizontal',
        left: '55%',
        bottom: 20
      },
      {
        min: 0,
        max: 1000,
        inRange: {
          color: ['grey'],
          opacity: [0, 0.9]
        },
        controller: {
          inRange: {
            opacity: [0.3, 0.6]
          },
          outOfRange: {
            color: '#ccc'
          }
        },
        seriesIndex: [1],
        orient: 'horizontal',
        left: '10%',
        bottom: 20
      }
    ],

    calendar: xData && xData.length > 0 ? xData?.map((x, ind) => {
      return {
        orient: 'vertical',
        yearLabel: {
          margin: 40
        },
        monthLabel: {
          nameMap: 'cn',
          margin: 20
        },
        dayLabel: {
          firstDay: 1,
          nameMap: 'cn'
        },
        cellSize: 40,
        left: 40 + (ind % 2) * 400,
        top: 80 + Math.floor(ind / 2) * 300,
        range: x
      }

    }) : [
      {
        orient: 'vertical',
        yearLabel: {
          margin: 40
        },
        monthLabel: {
          nameMap: 'cn',
          margin: 20
        },
        dayLabel: {
          firstDay: 1,
          nameMap: 'cn'
        },
        cellSize: 40,
        range: '2017-02'
      },
      {
        orient: 'vertical',
        yearLabel: {
          margin: 40
        },
        monthLabel: {
          margin: 20
        },
        cellSize: 40,
        left: 460,
        range: '2017-01'
      },
      {
        orient: 'vertical',
        yearLabel: {
          margin: 40
        },
        monthLabel: {
          margin: 20
        },
        cellSize: 40,
        top: 350,
        range: '2017-03'
      },
      {
        orient: 'vertical',
        yearLabel: {
          margin: 40
        },
        dayLabel: {
          firstDay: 1,
          nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        monthLabel: {
          nameMap: 'cn',
          margin: 20
        },
        cellSize: 40,
        top: 350,
        left: 460,
        range: '2017-04'
      }
    ],
    // @ts-ignore
    series: getSeriesByXDataLength(xData.length)
  }
}
