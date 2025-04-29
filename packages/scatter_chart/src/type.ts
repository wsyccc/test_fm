import { BaseWidgetDataType } from "@hulk/common";
import { ScatterChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface ScatterChartPropsInterface extends BaseWidgetDataType {
  category?: ScatterChartCategory;
  xData?: string[];
  yData?: NestedYData;
  additionalXData?: string[];
  symbolSize?: number;
  clusterCount?: number;
  interval?: number;
}

const ScatterChartPropsSchema = {
  category: {
    type: "string",
    enum: [
      "Basic",
      "Cluster",
      "ExponentialRegression",
      "LogarithmicRegression",
      "DistibutionAndAggregate",
      "SingleAxis",
      "Calendar"
    ],
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
  symbolSize: {
    type: "number",
    required: false
  },
  clusterCount: {
    type: "number",
    required: false
  },
  interval: {
    type: "number",
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

export default ScatterChartPropsSchema;