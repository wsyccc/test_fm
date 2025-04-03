import { useEffect } from 'react';
import {WebviewMessage} from "./type";

/**
 * 发送消息给宿主（WebView2）
 */
export const sendMessageToHost = (message: WebviewMessage) => {
  if (window.chrome && window.chrome.webview && typeof window.chrome.webview.postMessage === 'function') {
    window.chrome.webview.postMessage(message);
  } else {
    console.warn('WebView2 postMessage 方法不可用');
  }
};

/**
 * React hook：注册一个消息监听器，处理来自宿主的消息
 * @param handler 消息处理函数
 */
export const useWebviewListener = (handler: (message: WebviewMessage) => void) => {
  useEffect(() => {
    if (window.chrome && window.chrome.webview) {
      const listener = (event: MessageEvent) => {
        if (event.data) {
          handler(event.data);
        }
      };
      window.chrome.webview.addEventListener('message', listener);
      return () => {
        window.chrome.webview.removeEventListener('message', listener);
      };
    }
  }, [handler]);
};

/**
 * 对大数据的处理（例如分块发送）你也可以在这里实现
 * 例如：分块发送大数据
 */
export const sendLargeData = (data: any, chunkSize = 1024 * 500) => {
  const jsonData = JSON.stringify(data);
  const totalLength = jsonData.length;
  let start = 0;
  let chunkIndex = 0;
  while (start < totalLength) {
    const chunk = jsonData.slice(start, start + chunkSize);
    sendMessageToHost({
      type: 'largeDataChunk',
      payload: {
        chunkIndex,
        chunk,
        totalChunks: Math.ceil(totalLength / chunkSize)
      }
    });
    start += chunkSize;
    chunkIndex++;
  }
};
