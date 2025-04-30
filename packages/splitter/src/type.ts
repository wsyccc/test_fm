import { BaseWidgetDataType } from "@hulk/common";

interface PanelConfig {
  title?: string;
  collapsible?: boolean;
  resizable?: boolean;
  defaultSize?: number | string;
  min?: number | string;
  max?: number | string;
  style?: {};
  stylish?: {}
}

type NestedLayout = (PanelConfig | NestedLayout)[];

export interface SplitterPropsInterface extends BaseWidgetDataType {
  direction: "" | "vertical",
  layout: NestedLayout
}

const SplitterPropsSchema = {
  direction: {
    type: "string",
    enum: ["", "vertical"],
    required: true  // 接口中无问号
  },
  layout: {
    type: "array",
    required: true,  // 接口中无问号
    items: {
      oneOf: [
        { $ref: "#/definitions/PanelConfig" },
        { $ref: "#/definitions/NestedLayout" }
      ]
    }
  },
  definitions: {
    PanelConfig: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: {
          type: "string",
          required: false
        },
        collapsible: {
          type: "boolean",
          required: false
        },
        resizable: {
          type: "boolean",
          required: false
        },
        defaultSize: {
          oneOf: [
            { type: "number" },
            { type: "string" }
          ],
          required: false
        },
        min: {
          oneOf: [
            { type: "number" },
            { type: "string" }
          ],
          required: false
        },
        max: {
          oneOf: [
            { type: "number" },
            { type: "string" }
          ],
          required: false
        },
        style: {
          type: "object",
          required: false
        },
        stylish: {
          type: "object",
          required: false
        }
      }
    },
    NestedLayout: {
      type: "array",
      items: {
        oneOf: [
          { $ref: "#/definitions/PanelConfig" },
          { $ref: "#/definitions/NestedLayout" }
        ]
      }
    }
  }
};

export default SplitterPropsSchema;