import {BaseWidgetDataType} from "@hulk/common";
import { ThreeDChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface ThreeDChartPropsInterface extends BaseWidgetDataType{
  category?: ThreeDChartCategory;
  xData?: string[];
  yData?: NestedYData;
  additionalXData?: string[];
}