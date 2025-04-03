declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage?: (message: any) => void;
        addEventListener?: (event: string, handler: (e: MessageEvent) => void) => void;
        removeEventListener?: (event: string, handler: (e: MessageEvent) => void) => void;
      };
    };
  }
}

export {};
