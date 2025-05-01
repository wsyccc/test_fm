import { BaseWidgetDataType } from "@hulk/common";

type threeDimensionDataType = {
  x: number;
  y: number;
  z: number;
};

export type updateConfigObjectType = {
  name: string;
  position?: threeDimensionDataType;
  rotation?: threeDimensionDataType;
  scale?: threeDimensionDataType;
  color?: string;
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

  cameraPosition?: threeDimensionDataType;
  controlsTarget?: threeDimensionDataType;

  // alarms?: alarmType[];
  // 用户选择聚焦某个对象/图层
  focusItemName?: string,
  // 用户对某些对象/图层进行了操作，例如旋转、移动
  updatedConfigs?: updateConfigObjectType[]
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