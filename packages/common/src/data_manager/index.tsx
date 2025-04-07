// data_manager/index.tsx

import { useEffect } from 'react';
import { Message } from './Message';
import {MessageSource, BaseMessagePurpose, WidgetType} from '../../constatns';


// 如果 CHUNK_SIZE 设置较大数据时超过此大小则进行分块传输（单位：字节）
const CHUNK_SIZE = 512 * 1024; // 512KB
const VERSION = "0.0.0";

/**
 * 基本的消息发送函数
 */
export function sendMessage<T, S, F>(message: Message<T, S, F>): void {
  if (
    window.chrome &&
    window.chrome.webview &&
    typeof window.chrome.webview.postMessage === 'function'
  ) {
    window.chrome.webview.postMessage(message.toJSON());
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
export function useWebviewListener<T, S, F>(handler: (msg: Message<T, S, F>) => void): void {
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data) {
        try {
          handler(Message.toMessage(JSON.stringify(event.data)) as Message<T, S, F>);
        } catch (err) {
          console.error('Error handling message:', err);
        }
      }
    };

    if (window.chrome?.webview?.addEventListener) {
      window.chrome.webview.addEventListener('message', listener);
    } else {
      console.warn('WebView2 API is not available for adding listener.');
    }

    return () => {
      if (window.chrome?.webview?.removeEventListener) {
        window.chrome.webview.removeEventListener('message', listener);
      }
    };
  }, [handler]);
}


/**
 * 初始化与 WebView2 之间的握手通信
 * 前端启动时调用，通知宿主当前客户端信息和版本号（你可以扩展 payload 内容）
 */
export function initializeCommunication<T>(initPayload: T): void {
  const initMessage: Message<T> = new Message(
    "initialize",
    WidgetType.common,
    MessageSource.Hulk,
    BaseMessagePurpose.initialize,
    {
      payload: initPayload,
      version: VERSION,
    }


  );
  sendMessage(initMessage);
}