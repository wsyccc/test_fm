import {BaseWidgetDataType} from "@hulk/common";
import { CandleStickChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface CandleStickChartPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here
  category?: CandleStickChartCategory;
  xData?: string[];
  yData?: NestedYData;
  amount?: number;
}