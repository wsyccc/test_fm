import { BaseWidgetDataType } from "@hulk/common";

export type alarmType = {
  name: string;
  color: string;
}
export interface SpeedThreeDPropsInterface extends BaseWidgetDataType {
  id?: string;
  externalSourceLink?: string;
  alarms?: alarmType[];
}