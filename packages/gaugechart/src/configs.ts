import { WidgetType } from "@hulk/common";
import { GaugechartPropsInterface } from "./type";

export default {
  type: WidgetType.gaugechart,
  width: 400,
  height: 400,
  bgColor: "#ffffff",
  color: "#1890ff",
  axisColor: "#fff",
  progress: false,
  startAngle: 200,
  endAngle: -20,
  splitNumber: 10,
  labelDistance: -10,
  min: 0,
  max: 100,
  intervals: [],
  value: 50,
  fontSize: 15,
  prefix: "",
  suffix: "",
} as GaugechartPropsInterface