import {BaseTriggerActions, WidgetType} from "./constants";
import {CSSProperties} from "react";

export interface StyleConfig extends CSSProperties {
  [key: string]: any;
}

export interface BaseWidgetDataType {
  width: number;
  height: number;
  style?: StyleConfig;
  bgColor?: string;
  isStorybook?: boolean;
}

export interface BaseWidgetConfigType {
  id?: string;
  type?: WidgetType;
}

export enum StackType {
  vertical = 'vertical',
  horizontal = 'horizontal'
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
