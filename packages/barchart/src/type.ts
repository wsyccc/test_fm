import {BaseWidgetDataType} from "@hulk/common";
import { BarChartCategory } from "./utils";

export interface BarchartPropsInterface extends BaseWidgetDataType{
  id: string;
  bgColor?: string;
  // add more props here
  category?: BarChartCategory;
  legendEnabled?: boolean;
  legendLayout?: 'vertical' | 'horizontal';
  color?: string,

  labelEnabled?: boolean;
  labelPosition?: 'top' | 'inside';

  xData?: string[];
  yData?: {
    name: string;
    data: number[];
  }[];
}