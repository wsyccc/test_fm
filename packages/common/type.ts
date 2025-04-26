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
  widgetId?: string;
  type?: WidgetType;
}

/**
 * @example
 * {
 *   "widgetId": "123",
 *   "source": "title_change",
 *   "type": "onChange",
 *   "description": "button clicked",
 *   "payload": {
 *     "key": "value"
 *   }
 * }
 */
export interface BaseWidgetActionType {
  // the id of the widget that triggered the action
  widgetId?: string;
  // the source name of the action e.g. button, input, etc.
  source: string;
  // the action type
  type: BaseTriggerActions;
  description: string;
  // the action payload e.g. the data to be passed to the action
  payload: any;
}

export interface ActionPayload {
  widgetId: string;
  // paging for report builder
  pageNumber?: number;
  pageContentLimit?: number;
  // initial data for widgets
  version?: string;
}
