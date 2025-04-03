import {MessageType, PayloadType, WidgetType} from "../../constatns";


export type MessagePayload<T> = { type: PayloadType; payload: T }

export interface Message<T = any> {
  widgetId: string;
  widgetType: WidgetType;
  messageType: MessageType;
  payload: MessagePayload<T>;
}

