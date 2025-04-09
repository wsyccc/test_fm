import { ThreeDChartPropsInterface } from "./type";

export enum ThreeDChartCategory {
  Dataset = 'Dataset',
  Bar = 'Bar',
  Transparent = 'Transparent',
  Scatter = 'Scatter',
}

export function generateBasicChartOption({
  category, yData, xData, additionalXData
}: {
} & ThreeDChartPropsInterface): echarts.EChartsOption {

  const sizeValue = '57%';
  const symbolSize = 2.5;

  return category === ThreeDChartCategory.Bar || category === ThreeDChartCategory.Transparent ? {
    tooltip: {},
    visualMap: {
      max: 20,
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ]
      }
    },
    xAxis3D: {
      type: 'category',
      data: additionalXData
    },
    yAxis3D: {
      type: 'category',
      data: xData
    },
    zAxis3D: {
      type: 'value'
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      viewControl: {
        // projection: 'orthographic'
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    // @ts-ignore
    series: [
      {
        type: 'bar3D',
        data: yData && yData.length > 0 ? yData.map(function (item) {
          return {
            value: [item[1], item[0], item[2]]
          };
        }) : [],
        shading: 'lambert',
        label: {
          fontSize: 16,
          borderWidth: 1
        },
        itemStyle: {
          opacity: category === ThreeDChartCategory.Transparent ? 0.4 : 1
        },
        emphasis: {
          label: {
            fontSize: 20,
            color: '#900'
          },
          itemStyle: {
            color: '#900'
          }
        }
      }
    ]
  } : category === ThreeDChartCategory.Dataset ? {
    grid3D: {},
    tooltip: {},
    xAxis3D: {
      type: 'category'
    },
    yAxis3D: {
      type: 'category'
    },
    zAxis3D: {},
    // @ts-ignore
    visualMap: {
      max: 1e8,
      dimension: 'Population'
    },
    // @ts-ignore
    dataset: {
      dimensions: [
        'Income',
        'Life Expectancy',
        'Population',
        'Country',
        { name: 'Year', type: 'ordinal' }
      ],
      source: yData
    },
    // @ts-ignore
    series: [
      {
        type: 'bar3D',
        shading: 'lambert',
        encode: {
          x: 'Year',
          y: 'Country',
          z: 'Life Expectancy',
          tooltip: [0, 1, 2, 3, 4]
        }
      }
    ]
  } : category === ThreeDChartCategory.Scatter ? {
    tooltip: {},
    grid3D: {
      width: '50%'
    },
    xAxis3D: {},
    yAxis3D: {},
    zAxis3D: {},
    grid: [
      { left: '50%', width: '20%', bottom: sizeValue },
      { left: '75%', width: '20%', bottom: sizeValue },
      { left: '50%', width: '20%', top: sizeValue },
      { left: '75%', width: '20%', top: sizeValue }
    ],
    xAxis: [
      {
        type: 'value',
        gridIndex: 0,
        name: 'Income',
        // @ts-ignore
        axisLabel: { rotate: 50, interval: 0 }
      },
      {
        type: 'category',
        gridIndex: 1,
        name: 'Country',
        boundaryGap: false,
        axisLabel: { rotate: 50, interval: 0 }
      },
      {
        type: 'value',
        gridIndex: 2,
        name: 'Income',
        // @ts-ignore
        axisLabel: { rotate: 50, interval: 0 }
      },
      {
        type: 'value',
        gridIndex: 3,
        name: 'Life Expectancy',
        // @ts-ignore
        axisLabel: { rotate: 50, interval: 0 }
      }
    ],
    yAxis: [
      { type: 'value', gridIndex: 0, name: 'Life Expectancy' },
      { type: 'value', gridIndex: 1, name: 'Income' },
      { type: 'value', gridIndex: 2, name: 'Population' },
      { type: 'value', gridIndex: 3, name: 'Population' }
    ],
    // @ts-ignore
    dataset: {
      dimensions: [
        'Income',
        'Life Expectancy',
        'Population',
        'Country',
        { name: 'Year', type: 'ordinal' }
      ],
      source: yData
    },
    // @ts-ignore
    series: [
      {
        type: 'scatter3D',
        symbolSize: 3,
        encode: {
          x: 'Population',
          y: 'Life Expectancy',
          z: 'Income',
          tooltip: [0, 1, 2, 3, 4]
        }
      },
      {
        type: 'scatter',
        symbolSize: symbolSize,
        xAxisIndex: 0,
        yAxisIndex: 0,
        encode: {
          x: 'Income',
          y: 'Life Expectancy',
          tooltip: [0, 1, 2, 3, 4]
        }
      },
      {
        type: 'scatter',
        symbolSize: symbolSize,
        xAxisIndex: 1,
        yAxisIndex: 1,
        encode: {
          x: 'Country',
          y: 'Income',
          tooltip: [0, 1, 2, 3, 4]
        }
      },
      {
        type: 'scatter',
        symbolSize: symbolSize,
        xAxisIndex: 2,
        yAxisIndex: 2,
        encode: {
          x: 'Income',
          y: 'Population',
          tooltip: [0, 1, 2, 3, 4]
        }
      },
      {
        type: 'scatter',
        symbolSize: symbolSize,
        xAxisIndex: 3,
        yAxisIndex: 3,
        encode: {
          x: 'Life Expectancy',
          y: 'Population',
          tooltip: [0, 1, 2, 3, 4]
        }
      }
    ]
  } : {};
}