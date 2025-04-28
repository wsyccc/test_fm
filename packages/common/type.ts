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

export interface WidgetIdentityType {
  id?: string;
  type?: WidgetType;
  version?: string;
}


export interface MessagePayload {
  updateWidgets: {
    // updated widget id, normally is the widget itself,
    // but when you want to trigger an action by this widget, but update other widget data,
    // place the widgets' id that you want to update here
    id?: string;
    type?: WidgetType;
    version: string;
    data?: any;
  }[];
  webviewVersion?: string;
}

export interface ActionRequest {
  actions: BaseTriggerActions[],
  // paging for report builder
  pageNumber?: number;
  pageContentLimit?: number;
}