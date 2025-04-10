import { BaseWidgetDataType } from "@hulk/common";
import { TreeMapChartCategory } from "./utils";

interface NodeData {
  name?: string;
  value?: number;
  path?: string;
  children?: NodeData[]
}
export interface TreeMapChartPropsInterface extends BaseWidgetDataType {
  category?: TreeMapChartCategory;
  yData?: NodeData[]
}