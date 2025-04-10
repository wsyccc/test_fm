import {BaseWidgetDataType} from "@hulk/common";
import { DynamicBarChartCategory } from "./utils";

export interface DynamicBarchartPropsInterface extends BaseWidgetDataType{
  category?: DynamicBarChartCategory;
  
}