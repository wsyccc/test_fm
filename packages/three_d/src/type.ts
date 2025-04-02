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
  id: string;

  isStoryBook?: boolean;
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