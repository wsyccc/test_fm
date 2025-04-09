import {BaseWidgetDataType} from "@hulk/common";
import { ThreeDChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface ThreeDChartPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here
  category?: ThreeDChartCategory;
  xData?: string[];
  yData?: NestedYData;
  additionalXData?: string[];
}