import {CurrentWidgetIdentity} from "../../type";
import {Message} from "./Message";
import {BaseMessagePurpose} from "../../constants";
import {v4 as uuidv4 } from "uuid";

export const handleMessage = (message: Message, currentWidget: CurrentWidgetIdentity, widgetData: any, setWidgetData: (data: any) => void) => {
  if (message.purpose === BaseMessagePurpose.INIT) {

  } else {
    message.receiverMessagePayload?.updateWidgets.forEach(payload => {
      if (payload.widgetId === currentWidget.widgetId) {
        switch (message.purpose) {
          case BaseMessagePurpose.RECEIVE_WIDGET_DATA:
            setWidgetData({
              ...widgetData,
              ...payload.data
            });
            break;
        }
      }
    });
  }
}

export function parseReceiverMessagePayload(
  message: Message,
  widgetIdentity: CurrentWidgetIdentity
): {
  widgetId?: string;
  data?: any;
} | null {
  // on different version has different handle
  // const ver = message.receiverMessagePayload?.webviewVersion;

  if (message.purpose === BaseMessagePurpose.INIT && message.configDataString) {
    try {
      return {
        widgetId: message.widgetId ?? uuidv4(),
        data: JSON.parse(message.configDataString),
      }
    } catch (e) {
      console.warn('Failed to parse INIT payload:', e);
      return null;
    }
  }

  const updatePayload = message.receiverMessagePayload?.updateWidgets?.find(
    (payload) => payload.widgetId === widgetIdentity.widgetId
  );

  if (message.purpose === BaseMessagePurpose.RECEIVE_WIDGET_DATA && updatePayload) {
    return {
      data: JSON.parse(updatePayload.data),
    };
  }

  return null;
}