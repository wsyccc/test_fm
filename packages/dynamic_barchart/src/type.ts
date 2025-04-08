import {BaseWidgetDataType} from "@hulk/common";
import { DynamicBarChartCategory } from "./utils";

export interface DynamicBarchartPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here
  category?: DynamicBarChartCategory;
  
}