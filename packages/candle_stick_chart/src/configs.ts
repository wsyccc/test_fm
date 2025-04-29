import { WidgetType } from "@hulk/common";
import { CandleStickChartPropsInterface } from "./type";
import { CandleStickChartCategory } from "./utils";

export default {
  type: WidgetType.candle_stick_chart,
  width: 600,
  height: 400,
  bgColor: "#ffffff",
  category: CandleStickChartCategory.Basic,
  xData: ["2025-03-24", "2025-03-25", "2025-03-26", "2025-03-27"],
  yData: [
    [20, 34, 10, 38],
    [40, 35, 30, 50],
    [31, 38, 33, 44],
    [38, 15, 5, 42]
  ]
} as CandleStickChartPropsInterface