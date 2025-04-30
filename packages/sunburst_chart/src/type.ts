import {BaseWidgetDataType, StyleConfig} from "@hulk/common";
import { SunburstChartCategory } from "./utils";

interface NodeData {
  name?: string;
  value?: number;
  children?: NodeData[];
  itemStyle?: StyleConfig;
  label?: StyleConfig & {
    downplay?: StyleConfig
  };
}

export interface SunburstChartPropsInterface extends BaseWidgetDataType {
  category?: SunburstChartCategory;
  yData?: NodeData[]
}

const SunburstChartPropsSchema = {
  category: {
    type: "string",
    enum: ["Basic", "Rounded", "LabelRotate", "Monochrome", "Detail", "Advance"],
    required: false
  },
  yData: {
    type: "array",
    required: false,
    items: {
      $ref: "#/definitions/NodeData"
    }
  },
  definitions: {
    NodeData: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          required: false
        },
        value: {
          type: "number",
          required: false
        },
        children: {
          type: "array",
          items: {
            $ref: "#/definitions/NodeData"
          },
          required: false
        },
        itemStyle: {
          type: "object",
          required: false
        },
        label: {
          type: "object",
          required: false,
          properties: {
            downplay: {
              type: "object",
              required: false
            }
          }
        }
      }
    }
  }
};

export default SunburstChartPropsSchema;