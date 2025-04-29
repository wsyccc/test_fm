import {BaseWidgetDataType} from "@hulk/common";
import { DynamicBarChartCategory } from "./utils";

export interface DynamicBarchartPropsInterface extends BaseWidgetDataType{
  category?: DynamicBarChartCategory;
  
}

const DynamicBarchartPropsSchema = {
  category: {
    type: "string",
    enum: ["Drilldown", "LargeScale", "Race", "Dynamic", "Animation", "Finance"],
    required: false
  }
};

export default DynamicBarchartPropsSchema;