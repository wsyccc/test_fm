import { WidgetType } from "@hulk/common";
import { SunburstChartPropsInterface } from "./type";
import { SunburstChartCategory } from "./utils";
import { RAWDATA } from "./constants";

export default {
  type: WidgetType.sunburst_chart,
  width: 600,
  height: 400,
  bgColor: '#ffffff',
  category: SunburstChartCategory.Basic,
  yData: RAWDATA,
} as SunburstChartPropsInterface