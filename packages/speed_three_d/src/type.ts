import { BaseWidgetDataType } from "@hulk/common";

export type alarmType = {
  name: string;
  color: string;
}
export interface SpeedThreeDPropsInterface extends BaseWidgetDataType {
  externalSourceLink?: string;
  alarms?: alarmType[];
}