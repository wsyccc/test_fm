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
export interface SpeedThreeDPropsInterface extends BaseWidgetDataType {
  externalSourceLink?: string;
  // 用户选择聚焦某个对象/图层
  cameraPosition?: threeDimensionDataType;
  controlsTarget?: threeDimensionDataType;
  focusItemName?: string,
  // 用户对某些对象/图层进行了操作，例如旋转、移动
  updatedConfigs?: updateConfigObjectType[]
}

const SpeedThreeDPropsSchema = {
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

export default SpeedThreeDPropsSchema;