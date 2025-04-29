import {BaseWidgetDataType} from "@hulk/common";
import { ThreeDChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface ThreeDChartPropsInterface extends BaseWidgetDataType{
  category?: ThreeDChartCategory;
  xData?: string[];
  yData?: NestedYData;
  additionalXData?: string[];
}

const ThreeDChartPropsSchema = {
  category: {
    type: "string",
    enum: [], // 请提供 ThreeDChartCategory 的具体枚举值
    required: false
  },
  xData: {
    type: "array",
    items: { type: "string" },
    required: false
  },
  yData: {
    type: "array",
    required: false,
    items: {
      oneOf: [
        {
          type: "array",
          items: {
            oneOf: [
              { type: "number" },
              { type: "string" }
            ]
          }
        },
        { $ref: "#/definitions/NestedYData" }
      ]
    }
  },
  additionalXData: {
    type: "array",
    items: { type: "string" },
    required: false
  },
  definitions: {
    NestedYData: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "array",
            items: {
              oneOf: [
                { type: "number" },
                { type: "string" }
              ]
            }
          },
          { $ref: "#/definitions/NestedYData" }
        ]
      }
    }
  }
};

export default ThreeDChartPropsSchema;