import { WidgetType } from "@hulk/common";
import { DynamicBarchartPropsInterface } from "./type";
import { DynamicBarChartCategory } from "./utils";

export default {
  type: WidgetType.dynamic_barchart,
  width: 600,
  height: 400,
  category: DynamicBarChartCategory.Dynamic,
} as DynamicBarchartPropsInterface