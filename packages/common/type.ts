import {BaseTriggerActions, WidgetType} from "./constants";
import {CSSProperties} from "react";

export interface StyleConfig extends CSSProperties {
  [key: string]: any;
}

export interface BaseWidgetDataType {
  width: number | string;
  height: number | string;
  style?: Record<string, any>;
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