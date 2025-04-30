import {BaseTriggerActions, WidgetType} from "./constants";

export type StyleConfig = Record<string, any>;

export interface BaseWidgetDataType {
  width: number | string;
  height: number | string;
  style?: StyleConfig;
  bgColor?: string;
  isStorybook?: boolean;
}

export interface CurrentWidgetIdentity {
  widgetId?: string;
  widgetType?: WidgetType;
  widgetVersion?: string;
}


export interface ActionRequest {
  actions: BaseTriggerActions[],
  // paging for report builder
  pageNumber?: number;
  pageContentLimit?: number;
}