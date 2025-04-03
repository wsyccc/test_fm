export enum BarChartCategory {
  Basic = 'Basic',
  Vertical = 'Vertical',
  RadialPolar = 'Radial Polar',
  TangentialPolar = 'Tangential Polar',
  MixedLine = 'Mixed Line',
  Stacked = 'Stacked',
  StackedHorizontal = 'Stacked Horizontal',
}

export type BarChartRawDataType = {
  xData: string[];
  yData: {
    name: string;
    data: number[];
  }[];
};

const MixedLine = (configs: any, data: BarChartRawDataType) => {
  if (configs.category === BarChartCategory.MixedLine) {
    return data.yData.map((yD) => {
      return {
        animationDuration: 0,
        type: 'line',
        name: yD.name || '',
        data: yD.data,

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      };
    });
  }
  return [];
};

export function generateBarChartOption(configs: any, rawData: BarChartRawDataType) {
  let radialMax = 0;
  if (rawData.yData.length > 0) rawData.yData.map((yD) => {
    radialMax = Math.max(...yD.data, radialMax);
  });
  const legend = configs?.legendEnabled
    ? {
      orient: configs.legendLayout,
      textStyle: {
        color: configs.color,
      },
    }
    : null;
  const option =
    configs.category === BarChartCategory.RadialPolar
      ? {
        polar: {
          radius: [30, '90%'],
        },
        radiusAxis: {
          max: radialMax,
        },
        angleAxis: {
          type: 'category',
          startAngle: 75,
        },
        legend,
        series: [
          ...rawData.yData.map((yD) => {
            return {
              animationDuration: 0,
              type: 'bar',
              name: yD.name || '',
              data: yD.data,
              coordinateSystem: 'polar',

              label: {
                show: true,
                position: 'middle',
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            };
          }),
        ],
      }
      : configs.category === BarChartCategory.TangentialPolar
        ? {
          polar: {
            radius: [30, '90%'],
          },
          angleAxis: {
            max: radialMax,
            startAngle: 75,
          },
          radiusAxis: {
            type: 'category',
          },
          legend,
          series: [
            ...rawData.yData.map((yD) => {
              return {
                animationDuration: 0,
                type: 'bar',
                name: yD.name || '',
                data: yD.data,
                coordinateSystem: 'polar',

                label: {
                  show: true,
                  position: 'middle',
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              };
            }),
          ],
        }
        : {
          xAxis: {
            type: [BarChartCategory.Vertical, BarChartCategory.StackedHorizontal].includes(
              configs.category,
            )
              ? 'value'
              : 'category',
            data: rawData.xData,
          },
          yAxis: {
            type: [BarChartCategory.Vertical, BarChartCategory.StackedHorizontal].includes(
              configs.category,
            )
              ? 'category'
              : 'value',
            // 注意这里yAxis用xData的原因是eChart在把柱状图从水平变成垂直时，不会把x轴数据传递给y轴，导致y轴会显示默认的数字数组
            // 没必要做判断，因为echart渲染时会自动判断
            data: rawData.xData,
          },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          legend,
          series: [
            ...MixedLine(configs, rawData),
            ...(Array.isArray(rawData.yData)
              ? rawData.yData.map((yD) => {
                return {
                  animationDuration: 0,
                  type: 'bar',
                  name: yD.name || '',
                  data: yD.data,
                  stack: [BarChartCategory.Stacked, BarChartCategory.StackedHorizontal].includes(
                    configs.category,
                  )
                    ? 'Total'
                    : '',
                  label: {
                    show: configs.labelEnabled,
                    position: configs.labelPosition,
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                };
              }) : []),
          ],
        };

  return option;
}