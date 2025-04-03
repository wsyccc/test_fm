// data_manager/index.tsx

import { useEffect } from 'react';
import { Message } from './type';
import {MessageType, PayloadType, WidgetType} from '../../constatns';


// 如果 CHUNK_SIZE 设置较大数据时超过此大小则进行分块传输（单位：字节）
const CHUNK_SIZE = 512 * 1024; // 512KB

/**
 * 基本的消息发送函数
 */
export function sendMessage<T>(message: Message<T>): void {
  if (
    window.chrome &&
    window.chrome.webview &&
    typeof window.chrome.webview.postMessage === 'function'
  ) {
    window.chrome.webview.postMessage(message);
  } else {
    console.warn('WebView2 API is not available.');
  }
}

/**
 * 处理大数据的消息发送
 * 如果消息数据量超过 CHUNK_SIZE，就将消息 JSON 化后分块传输，
 * 每个块都采用 updateWidgetData 类型封装 chunk 信息（你可以扩展协议定义专门的 chunk 类型）
 */
export function sendLargeMessage<T>(message: Message<T>, chunkSize: number = CHUNK_SIZE): void {
  const jsonString = JSON.stringify(message);
  const totalLength = jsonString.length;

  if (totalLength <= chunkSize) {
    // 不超限，直接发送
    sendMessage(message);
    return;
  }

  const totalChunks = Math.ceil(totalLength / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const chunkData = jsonString.slice(i * chunkSize, (i + 1) * chunkSize);

    // 这里仅示例：把分块数据塞到同一个 payload 里
    // 也可以在你的协议中定义专门的 ChunkPayload
    const chunkMessage: Message<any> = {
      widgetId: message.widgetId,
      widgetType: message.widgetType,
      messageType: message.messageType,
      payload: {
        type: PayloadType.updateWidgetData,
        payload: {
          chunkIndex: i,
          totalChunks,
          chunkData
        }
      }
    };

    sendMessage(chunkMessage);
  }
}

/**
 * React Hook：注册 WebView2 消息监听器
 * 传入的 handler 用于处理所有收到的消息
 */
export function useWebviewListener<T>(handler: (msg: T) => void): void {
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data) {
        try {
          handler(event.data as T);
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
  const initMessage: Message<T> = {
    widgetId: 'frontend',
    widgetType: WidgetType.button,
    messageType: MessageType.request,
    payload: {
      type: PayloadType.initialize,
      payload: initPayload
    }
  };
  sendMessage(initMessage);
}