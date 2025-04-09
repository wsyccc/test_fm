import {BaseTriggerActions, WidgetType} from "./constants";

export interface BaseWidgetDataType {
  width: number;
  height: number;
  bgColor?: string;
  isStorybook?: boolean;
}

export interface BaseWidgetConfigType {
  id?: string;
  type?: WidgetType;
  width?: number;
  height?: number;
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