import { BaseWidgetDataType } from "@hulk/common";

export type alarmType = {
  name: string;
  color: string;
}

type threeDimensionDataType = {
  x: number;
  y: number;
  z: number;
};

export type updateConfigObjectType = {
  position: threeDimensionDataType;
  rotation: threeDimensionDataType;
  scale: threeDimensionDataType;
};
export interface ThreeDPropsInterface extends BaseWidgetDataType {
  externalSourceLink?: string;
  shallowTheme?: boolean;
  wireframe?: boolean;
  transparent?: boolean;
  grid?: boolean;

  ambientLight?: number;
  xScale?: number;
  yScale?: number;
  zScale?: number;
  alarms?: alarmType[];
}

const ThreeDPropsSchema = {
  width: {
    type: "number",
    required: false,
  },
  height: {
    type: "number",
    required: false,
  },
  externalSourceLink: {
    type: "string",
    required: false
  },
  shallowTheme: {
    type: "boolean",
    required: false
  },
  wireframe: {
    type: "boolean",
    required: false
  },
  transparent: {
    type: "boolean",
    required: false
  },
  grid: {
    type: "boolean",
    required: false
  },
  ambientLight: {
    type: "number",
    required: false
  },
  xScale: {
    type: "number",
    required: false
  },
  yScale: {
    type: "number",
    required: false
  },
  zScale: {
    type: "number",
    required: false
  },
  alarms: {
    type: "array",
    required: false,
    items: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          required: true
        },
        color: {
          type: "string",
          required: true
        }
      }
    }
  }
};

export default ThreeDPropsSchema;