import { BaseWidgetDataType } from "@hulk/common";

export type alarmType = {
  name: string;
  color: string;
}
export interface SpeedThreeDPropsInterface extends BaseWidgetDataType {
  externalSourceLink?: string;
  alarms?: alarmType[];
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