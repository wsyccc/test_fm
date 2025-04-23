import {BaseWidgetDataType} from "@hulk/common";
import { BarChartCategory } from "./utils";

export interface BarchartPropsInterface extends BaseWidgetDataType{
  bgColor?: string;
  // add more props here
  category?: BarChartCategory;
  legendEnabled?: boolean;
  legendLayout?: 'vertical' | 'horizontal';
  color?: string,

  labelEnabled?: boolean;
  labelPosition?: 'top' | 'inside';
  rawData?: {
    rows: {
      columns: {
        name: string;
        value: string;
      }[];
    }[];
  },
  xColumn?: string,
  yColumns?: string[],
  xData?: string[];
  yData?: {
    name: string;
    data: number[];
  }[];
}