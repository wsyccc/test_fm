import {BaseWidgetDataType} from "@hulk/common";
import { CandleStickChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface CandleStickChartPropsInterface extends BaseWidgetDataType{
  category?: CandleStickChartCategory;
  xData?: string[];
  yData?: NestedYData;
  amount?: number;
}