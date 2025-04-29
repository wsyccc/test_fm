import { WidgetType } from "@hulk/common";
import { BarChartCategory } from "./utils";
import { BarchartPropsInterface } from "./type";

export default {
  type: WidgetType.barchart,
  width: 600,
  height: 400,
  bgColor: "#ffffff",
  color: "#1890ff",
  category: BarChartCategory.Basic,
  legendEnabled: true,
  legendLayout: "vertical",
  labelEnabled: true,
  labelPosition: "top",
  xData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  yData: [{
    name: "amount",
    data: [120, 200, 150, 80, 70, 110, 130]
  }],
} as BarchartPropsInterface