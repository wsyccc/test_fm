import {BaseWidgetDataType} from "@hulk/common";
import { OtherChartsCategory } from "./utils";

export interface OtherChartsPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here

  category?: OtherChartsCategory;
  xData?: string[];
  yData?: any;
}