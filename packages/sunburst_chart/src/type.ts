import { BaseWidgetDataType } from "@hulk/common";
import { SunburstChartCategory } from "./utils";
import { CSSProperties } from "react";

interface NodeData {
  name?: string;
  value?: number;
  children?: NodeData[];
  itemStyle?: CSSProperties;
  label?: CSSProperties & {
    downplay?: CSSProperties
  };
}

export interface SunburstChartPropsInterface extends BaseWidgetDataType {
  category?: SunburstChartCategory;
  yData?: NodeData[]
}