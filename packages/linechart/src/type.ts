import {BaseWidgetDataType} from "@hulk/common";
import { LineChartCategory } from "./utils";

export interface LinechartPropsInterface extends BaseWidgetDataType{
  id?: string;
  bgColor?: string;
  // add more props here
  category?: LineChartCategory;
  legendEnabled?: boolean;
  legendLayout?: 'vertical' | 'horizontal';
  color?: string,

  labelEnabled?: boolean;
  labelPosition?: 'top' | 'inside';

  xData?: string[];
  yData?: {
    name: string;
    data: number[];
    step?: 'start' | 'middle' | 'end'
  }[];
}