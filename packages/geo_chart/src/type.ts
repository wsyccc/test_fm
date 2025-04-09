import {BaseWidgetDataType} from "@hulk/common";
import { GeoChartCategory } from "./utils";

export interface GeoChartPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here
  category?: GeoChartCategory;
  externalSourceLink?: string;
}