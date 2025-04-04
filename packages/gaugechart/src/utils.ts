import { GaugechartPropsInterface } from "./type";

export function generateGaugeChartOption(configs: GaugechartPropsInterface) {
  const { startAngle, endAngle, min, max, splitNumber, prefix, value, suffix, color, axisColor, intervals, fontSize, labelDistance } = configs;

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle,
        endAngle,
        min,
        max,
        splitNumber,
        itemStyle: {
          color,
        },
        progress: {
          show: configs.progress ?? false,
          width: fontSize ? fontSize * 2 : 30
        },
        axisLine: {
          lineStyle: {
            width: fontSize ? fontSize * 2 : 30,
            ...(intervals && intervals.length > 0 ? { color: intervals } : {})
          }
        },
        axisLabel: {
          distance: labelDistance,
          color: axisColor,
          fontSize: 15
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 15,
          formatter: `${prefix} {value} ${suffix}`,
          color: color ?? 'inherit'
        },
        data: [
          {
            value
          }
        ]
      },

    ]
  };
  return option;
}