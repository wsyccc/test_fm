import { BaseWidgetDataType } from "@hulk/common";

export type GaugeChartRawDataType = {
  xData: string[];
  yData: {
    name: string;
    value: number[];
  }[];
};

export interface GaugechartPropsInterface extends BaseWidgetDataType {
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

const GaugechartPropsSchema = {
  // Gauge 特有属性
  color: {
    type: "string",
    required: false
  },
  axisColor: {
    type: "string",
    required: false
  },
  progress: {
    type: "boolean",
    required: false
  },
  startAngle: {
    type: "number",
    minimum: 0,
    maximum: 360,
    required: false
  },
  endAngle: {
    type: "number",
    minimum: 0,
    maximum: 360,
    required: false
  },
  splitNumber: {
    type: "number",
    minimum: 1,
    required: false
  },
  min: {
    type: "number",
    required: false
  },
  max: {
    type: "number",
    required: false
  },
  labelDistance: {
    type: "number",
    minimum: 0,
    required: false
  },
  intervals: {
    type: "array",
    required: false,
    items: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: [
        { type: "number" },
        { type: "string" }
      ]
    }
  },
  value: {
    type: "number",
    required: false
  },
  fontSize: {
    type: "number",
    minimum: 1,
    required: false
  },
  prefix: {
    type: "string",
    required: false
  },
  suffix: {
    type: "string",
    required: false
  }
};

export default GaugechartPropsSchema;