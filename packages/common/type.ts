import {WidgetActions} from "./constatns";

export interface BaseWidgetDataType {
  id?: string;
  width: number;
  height: number;
  bgColor?: string;
  isStorybook?: boolean;
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
  type: WidgetActions;
  description: string;
  // the action payload e.g. the data to be passed to the action
  payload: any;
}