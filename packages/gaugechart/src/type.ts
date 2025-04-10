import { BaseWidgetDataType } from "@hulk/common";

export enum GaugeChartCategory {
  Basic = 'Basic',
  Vertical = 'Vertical',
  RadialPolar = 'Radial Polar',
  TangentialPolar = 'Tangential Polar',
  MixedLine = 'Mixed Line',
  Stacked = 'Stacked',
  StackedHorizontal = 'Stacked Horizontal',
}

export type GaugeChartRawDataType = {
  xData: string[];
  yData: {
    name: string;
    value: number[];
  }[];
};

export interface GaugechartPropsInterface extends BaseWidgetDataType {
  category?: GaugeChartCategory;
  color?: string,
  axisColor?: string,
  progress?: boolean,

  // 扇形开始角度
  startAngle?: number,
  endAngle?: number,
  // 多少等分
  splitNumber?: number,
  // 最大最小值
  min?: number;
  max?: number;

  // 图上的label距离中心的距离
  labelDistance?: number;
  // 每个区间不同颜色
  intervals?: [number, string][],
  // 当前值
  value?: number;
  // 字体大小决定了所有label/value，包括进度条和测量区域的大小
  fontSize?: number;
  // 当前值前缀名
  prefix?: string;
  // 当前值后缀名
  suffix?: string;
}