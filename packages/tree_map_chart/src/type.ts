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

const TreeMapChartPropsSchema = {
  category: {
    type: "string",
    enum: ["Basic", "Complex"], // 来自 TreeMapChartCategory
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
        path: {
          type: "string",
          required: false
        },
        children: {
          type: "array",
          items: {
            $ref: "#/definitions/NodeData"
          },
          required: false
        }
      }
    }
  }
};

export default TreeMapChartPropsSchema;