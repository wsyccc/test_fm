import {BaseWidgetDataType} from "@hulk/common";
import { OtherChartsCategory } from "./utils";

export interface OtherChartsPropsInterface extends BaseWidgetDataType{
  category?: OtherChartsCategory;
  xData?: string[];
  yData?: any;
}