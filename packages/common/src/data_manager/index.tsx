// data_manager/index.tsx

import {useEffect} from 'react';
import {Message} from './Message';


/**
 * 基本的消息发送函数
 */
export function sendMessage(message: Message): void {
  if (typeof window.postMessage === 'function') {
    console.log('Sending message:', message);
    window.postMessage({
      ...message.toJSON(),
      version: import.meta.env.VITE_VERSION,
    });
  } else {
    console.warn('WebView2 API is not available.');
  }
}

/**
 * 处理大数据的消息发送
 * 如果消息数据量超过 CHUNK_SIZE，就将消息 JSON 化后分块传输，
 * 每个块都采用 updateWidgetData 类型封装 chunk 信息（你可以扩展协议定义专门的 chunk 类型）
 */
// export function sendLargeMessage<T, S, F>(message: Message<T, S, F>, chunkSize: number = CHUNK_SIZE): void {
//   const jsonString = message.toString();
//   const totalLength = jsonString.length;
//
//   if (totalLength <= chunkSize) {
//     sendMessage(message);
//     return;
//   }
//
//   const totalChunks = Math.ceil(totalLength / chunkSize);
//
//   for (let i = 0; i < totalChunks; i++) {
//     const chunkData = jsonString.slice(i * chunkSize, (i + 1) * chunkSize);
//
//
//     const chunkMessage: Message = {
//       widgetId: message.widgetId,
//       widgetType: message.widgetType,
//       messageType: message.messageType,
//       payload: {
//         type: BaseMessagePurpose.updateWidgetData,
//         payload: {
//           chunkIndex: i,
//           totalChunks,
//           chunkData
//         }
//       }
//     };
//
//     sendMessage(chunkMessage);
//   }
// }

/**
 * React Hook：注册 WebView2 消息监听器
 * 传入的 handler 用于处理所有收到的消息
 */
export function useWebviewListener(handler: (msg: Message) => void): void {
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data) {
        try {
          handler(Message.toMessage(JSON.stringify(event.data)) as Message);
        } catch (err) {
          console.error('Error handling message:', err);
        }
      }
    };

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('message', listener);
    } else {
      console.warn('WebView2 API is not available for adding listener.');
    }

    return () => {
      if (typeof window.removeEventListener === 'function') {
        window.removeEventListener('message', listener);
      }
    };
  }, [handler]);
}