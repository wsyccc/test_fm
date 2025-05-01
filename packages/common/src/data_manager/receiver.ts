import {CurrentWidgetIdentity} from "../../type";
import {Message} from "./Message";
import {BaseMessagePurpose} from "../../constants";
import {v4 as uuidv4 } from "uuid";


/**
 * Parses the message payload received from the receiver and extracts the widget data.
 *
 * @param {Message} message - The message object received from the receiver.
 * @param {CurrentWidgetIdentity} widgetIdentity - The identity object representing the current widget.
 * @return {{widgetId?: string, data?: any} | null} The parsed payload containing the widget ID and data,
 * or null if the message is not relevant or parsing fails.
 */
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