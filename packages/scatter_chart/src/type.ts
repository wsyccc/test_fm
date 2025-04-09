import { BaseWidgetDataType } from "@hulk/common";
import { ScatterChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface ScatterChartPropsInterface extends BaseWidgetDataType {
  id?: string;
  bgColor?: string;
  // add more props here
  category?: ScatterChartCategory;
  xData?: string[];
  yData?: NestedYData;
  additionalXData?: string[];
  symbolSize?: number;
  clusterCount?: number;
  interval?: number;
}