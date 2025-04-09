import { BaseWidgetDataType } from "@hulk/common";
import { TreeMapChartCategory } from "./utils";

interface NodeData {
  name?: string;
  value?: number;
  path?: string;
  children?: NodeData[]
}
export interface TreeMapChartPropsInterface extends BaseWidgetDataType {
  id?: string;
  bgColor?: string;
  // add more props here
  category?: TreeMapChartCategory;
  yData?: NodeData[]
}