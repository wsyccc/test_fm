import {BaseWidgetDataType} from "@hulk/common";
import { GeoChartCategory } from "./utils";

export interface GeoChartPropsInterface extends BaseWidgetDataType{
  category?: GeoChartCategory;
  externalSourceLink?: string;
}