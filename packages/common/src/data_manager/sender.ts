import {Message} from "./Message";
import {BaseMessagePurpose} from "../../constants";

export const parseSenderMessagePayload = (message: Message) => {
  // at runtime the server side already has the data
  if (msg.purpose === BaseMessagePurpose.INIT) {
    const data = msg.payload?.updateWidgets[0].data;
    widgetIdentity.current.id = msg.widgetId;
    widgetIdentity.current.type = msg.widgetType;
    setWidgetData(data);
  } else {
    const data = msg.payload?.updateWidgets.find(item => item.id === widgetIdentity.current.id );
    if (!data) return;
    if (msg.purpose === BaseMessagePurpose.SEND_NOTIFY_ACTIONS) {
      const newData = data.data;
      console.log('Received updateWidgetData:', newData);
      updateWidgetData({...widgetData, ...newData} as T);
    } else {
      console.warn('Received unknown message:', msg);
    }
  }
}