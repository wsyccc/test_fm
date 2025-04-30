import { BaseWidgetDataType } from "@hulk/common";
import { LineChartCategory } from "./utils";

export interface LinechartPropsInterface extends BaseWidgetDataType {
  category?: LineChartCategory;
  legendEnabled?: boolean;
  legendLayout?: "vertical" | "horizontal";
  color?: string,

  labelEnabled?: boolean;
  labelPosition?: "top" | "inside";
  rawData?: {
    rows: {
      columns: {
        name: string;
        value: string;
      }[];
    }[];
  },
  xColumn?: string,
  yColumns?: string[],
  xData?: string[];
  yData?: {
    name: string;
    data: number[];
    step?: "start" | "middle" | "end"
  }[];
}

const LinechartPropsSchema = {
  category: {
    type: "string",
    enum: ["Basic", "Smoothed", "Area", "Stacked Line", "Stacked Area", "Race", "Step"],
    required: false
  },
  legendEnabled: {
    type: "boolean",
    required: false
  },
  legendLayout: {
    type: "string",
    enum: ["vertical", "horizontal"],
    required: false
  },
  color: {
    type: "string",
    required: false
  },
  labelEnabled: {
    type: "boolean",
    required: false
  },
  labelPosition: {
    type: "string",
    enum: ["top", "inside"],
    required: false
  },
  rawData: {
    type: "object",
    required: false,
    additionalProperties: false,
    properties: {
      rows: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            columns: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string", required: true },
                  value: { type: "string", required: true }
                }
              }
            }
          }
        }
      }
    }
  },
  xColumn: {
    type: "string",
    required: false
  },
  yColumns: {
    type: "array",
    items: { type: "string" },
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
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", required: true },
        data: {
          type: "array",
          items: { type: "number" },
          required: true
        },
        step: {
          type: "string",
          enum: ["start", "middle", "end"],
          required: false
        }
      }
    }
  }
};

const LineChartPropsSchemaJSON = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "width": {
      "type": [
        "number",
        "string"
      ]
    },
    "height": {
      "type": [
        "number",
        "string"
      ]
    },
    "style": {
      "$ref": "#/definitions/StyleConfig"
    },
    "bgColor": {
      "type": "string"
    },
    "isStorybook": {
      "type": "boolean"
    },
    "category": {
      "$ref": "#/definitions/LineChartCategory"
    },
    "legendEnabled": {
      "type": "boolean"
    },
    "legendLayout": {
      "type": "string",
      "enum": [
        "vertical",
        "horizontal"
      ]
    },
    "color": {
      "type": "string"
    },
    "labelEnabled": {
      "type": "boolean"
    },
    "labelPosition": {
      "type": "string",
      "enum": [
        "top",
        "inside"
      ]
    },
    "rawData": {
      "type": "object",
      "properties": {
        "rows": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "columns": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "value": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "columns"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "rows"
      ],
      "additionalProperties": false
    },
    "xColumn": {
      "type": "string"
    },
    "yColumns": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "xData": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "yData": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "data": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "step": {
            "type": "string",
            "enum": [
              "start",
              "middle",
              "end"
            ]
          }
        },
        "required": [
          "name",
          "data"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "height",
    "width"
  ],
  "definitions": {
    "LineChartCategory": {
      "type": "string",
      "enum": [
        "Basic",
        "Smoothed",
        "Area",
        "Stacked Line",
        "Stacked Area",
        "Race",
        "Step"
      ]
    }
  }
}

export default LineChartPropsSchemaJSON;