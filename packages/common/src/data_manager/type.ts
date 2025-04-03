import {MessageType, WidgetType} from "../../constatns";


export interface MessagePayload<T> {
  initialize?: {
    type: "initialize";
    payload: T;
  },
  updateWidgetData?: {
    type: "updateWidgetData";
    payload: T;
  },
  triggerAction?: {
    type: "triggerAction";
    payload: T;
  }
}

export interface Message<T = any> {
  widgetId: string;
  widgetType: WidgetType;
  messageType: MessageType;
  payload: MessagePayload<T>;
}

