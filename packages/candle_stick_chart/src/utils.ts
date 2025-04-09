import { CandleStickChartPropsInterface } from "./type";
import { Echarts } from '@hulk/common';

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';

export enum CandleStickChartCategory {
  Basic = 'Basic',
  Detail = 'Detail',
  LargeScale = 'LargeScale',
  AxisPointer = 'AxisPointer'
}

function generateOHLC(count) {
  let data: any[] = [];
  let xValue = +new Date(2011, 0, 1);
  let minute = 60 * 1000;
  let baseValue = Math.random() * 12000;
  let boxVals = new Array(4);
  let dayRange = 12;
  for (let i = 0; i < count; i++) {
    baseValue = baseValue + Math.random() * 20 - 10;
    for (let j = 0; j < 4; j++) {
      boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
    }
    boxVals.sort();
    let openIdx = Math.round(Math.random() * 3);
    let closeIdx = Math.round(Math.random() * 2);
    if (closeIdx === openIdx) {
      closeIdx++;
    }
    let volumn = boxVals[3] * (1000 + Math.random() * 500);
    // ['open', 'close', 'lowest', 'highest', 'volumn']
    // [1, 4, 3, 2]
    data[i] = [
      Echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', (xValue += minute)),
      +boxVals[openIdx].toFixed(2),
      +boxVals[3].toFixed(2),
      +boxVals[0].toFixed(2),
      +boxVals[closeIdx].toFixed(2),
      +volumn.toFixed(0),
      getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 4) // sign
    ];
  }
  return data;
  function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
    var sign;
    if (openVal > closeVal) {
      sign = -1;
    } else if (openVal < closeVal) {
      sign = 1;
    } else {
      sign =
        dataIndex > 0
          ? // If close === open, compare with close of last record
          data[dataIndex - 1][closeDimIdx] <= closeVal
            ? 1
            : -1
          : // No record of previous, set to be positive
          1;
    }
    return sign;
  }
}


export function generateBasicCandleStickChartOption({
  xData, yData, category, amount
}: {
} & CandleStickChartPropsInterface): echarts.EChartsOption {

  const colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
  const labelFont = 'bold 12px Sans-serif';

  function splitData(rawData: any[]) {
    const categoryData: (string | number)[] = [];
    const values: (string | number)[][] = [];

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];
      categoryData.push(item[0]); // ✅ 不修改原始数组
      values.push(item.slice(1)); // ✅ 拿后面的 open/close/low/high
    }

    return {
      categoryData,
      values
    };
  }

  const tempData = yData && yData.length ? splitData(yData) : { categoryData: [], values: [] };

  function calculateMA(dayCount: number, temp?: boolean) {
    var result: (string | number)[] = [];
    const d = temp ? tempData.values : (yData ?? [])
    for (var i = 0, len = d.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +d[i - j][1];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  }

  const volumes = [8616, 7933, 10260, 10489, 8523, 11523, 9941, 9012, 7999, 10710, 8102, 9171, 8451, 11816, 8939, 8982, 10021, 10272, 13412, 8377, 9257, 10909, 10092, 13667, 8010, 9706, 9502, 8153, 8002, 8559, 7579, 8739, 8856, 8664, 8844, 10326, 7912, 9553, 11199, 8779, 8648, 7918, 6894, 7319, 14739, 7853, 7556, 8227, 7187, 7875, 7126, 6969, 9054, 10169, 9374, 9413, 9195, 24868, 9938, 8513, 8944];

  const dataCount = amount ?? 4e2;
  const largeScaleData = generateOHLC(dataCount);

  return category === CandleStickChartCategory.Basic ? {
    xAxis: {
      data: xData
    },
    yAxis: {},
    // @ts-ignore
    series: [
      {
        type: 'candlestick',
        data: yData
      }
    ]
  } : category === CandleStickChartCategory.Detail ? {
    title: {
      text: '上证指数',
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: tempData.categoryData,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: tempData.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },
        markPoint: {
          label: {
            formatter: function (param: any) {
              return param != null ? Math.round(param.value) + '' : '';
            }
          },
          data: [
            {
              name: 'Mark',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                color: 'rgb(41,60,85)'
              }
            },
            {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest'
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close'
            }
          ],
          tooltip: {
            formatter: function (param: any) {
              return param.name + '<br>' + (param.data.coord || '');
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close'
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close'
            }
          ]
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, true),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, true),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, true),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, true),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      }
    ]
  } : category === CandleStickChartCategory.AxisPointer ? {
    animation: false,
    color: colorList,
    title: {
      left: 'center',
      text: 'Candlestick'
    },
    legend: {
      top: 30,
      data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      triggerOn: 'none',
      transitionDuration: 0,
      confine: true,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: 'rgba(255,255,255,0.9)',
      textStyle: {
        fontSize: 12,
        color: '#333'
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 60
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: [0, 1]
        }
      ]
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: [0, 1],
        realtime: false,
        start: 20,
        end: 70,
        top: 65,
        height: 20,
        handleIcon:
          'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '120%'
      },
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 40,
        end: 70,
        top: 30,
        height: 20
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: xData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#777' } },
        axisLabel: {
          formatter: function (value) {
            return Echarts.format.formatTime('MM-dd', value);
          }
        },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          show: true
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: xData,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#777' } },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          type: 'shadow',
          label: { show: false },
          triggerTooltip: true,
          handle: {
            show: true,
            margin: 30,
            color: '#B80C00'
          }
        }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 2,
        axisLine: { lineStyle: { color: '#777' } },
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
          inside: true,
          formatter: '{value}\n'
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    grid: [
      {
        left: 20,
        right: 20,
        top: 110,
        height: 120
      },
      {
        left: 20,
        right: 20,
        height: 40,
        top: 260
      }
    ],
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: 70,
        width: 300,
        bounding: 'raw',
        children: [
          {
            id: 'MA5',
            type: 'text',
            style: { fill: colorList[1], font: labelFont },
            left: 0
          },
          {
            id: 'MA10',
            type: 'text',
            style: { fill: colorList[2], font: labelFont },
            left: 'center'
          },
          {
            id: 'MA20',
            type: 'text',
            style: { fill: colorList[3], font: labelFont },
            right: 0
          }
        ]
      }
    ],
    // @ts-ignore
    series: [
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#7fbe9e'
        },
        emphasis: {
          itemStyle: {
            color: '#140'
          }
        },
        data: volumes
      },
      {
        type: 'candlestick',
        name: '日K',
        data: yData,
        itemStyle: {
          color: '#ef232a',
          color0: '#14b143',
          borderColor: '#ef232a',
          borderColor0: '#14b143'
        },
        emphasis: {
          itemStyle: {
            color: 'black',
            color0: '#444',
            borderColor: 'black',
            borderColor0: '#444'
          }
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      }
    ]
  } : category === CandleStickChartCategory.LargeScale ? {
    dataset: {
      source: largeScaleData
    },
    title: {
      text: 'Data Amount: ' + Echarts.format.addCommas(dataCount)
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        }
      }
    },
    grid: [
      {
        left: '10%',
        right: '10%',
        bottom: 200
      },
      {
        left: '10%',
        right: '10%',
        height: 80,
        bottom: 80
      }
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        // inverse: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 1,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 10,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        bottom: 10,
        start: 10,
        end: 100
      }
    ],
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 6,
      pieces: [
        {
          value: 1,
          color: upColor
        },
        {
          value: -1,
          color: downColor
        }
      ]
    },
    series: [
      {
        type: 'candlestick',
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },
        encode: {
          x: 0,
          y: [1, 4, 3, 2]
        }
      },
      {
        name: 'Volumn',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#7fbe9e'
        },
        large: true,
        encode: {
          x: 0,
          y: 5
        }
      }
    ]
  } : {};
}