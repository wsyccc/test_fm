import {BaseWidgetDataType} from "@hulk/common";
import { OtherChartsCategory } from "./utils";

export interface OtherChartsPropsInterface extends BaseWidgetDataType{
  category?: OtherChartsCategory;
  xData?: string[];
  yData?: any;
}

const OtherChartsPropsSchema = {
  category: {
    type: "string",
    enum: [
      "SimpleGraph",
      "GraphOnCartesian",
      "GraphOverlap",
      "Tree",
      "MultiTrees",
      "RadialTree",
      "SimpleParallel",
      "SimpleFunnel",
      "RichText"
    ],
    required: false
  },
  xData: {
    type: "array",
    items: {
      type: "string"
    },
    required: false
  },
  yData: {
    type: "any",  // 任意类型
    required: false
  }
};

export default OtherChartsPropsSchema;